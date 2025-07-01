defmodule Burn.Agents.Supervisor do
  @moduledoc """
  Supervisor that manages agent GenServer processes across all threads.
  
  Uses Electric shapes to reactively monitor threads and memberships,
  ensuring that every agent in every thread has their GenServer process running.
  """
  
  use GenServer
  
  alias Burn.{
    Accounts,
    Agents,
    Consumer,
    Messages,
    Repo,
    Shapes,
    Threads
  }

  defmodule State do
    defstruct [
      # Internal
      :supervisor,
      :tasks,

      # State
      :data, # %{thread_id => %{agent_name => pid}}
      :pids # %{pid => {agent_name, thread_id}}
    ]
  end

  @agents %{
    "sarah" => Agents.Sarah,
    # ...
  }

  # Client API

  @spec start_link(keyword()) :: GenServer.on_start()
  def start_link(opts \\ []) do
    GenServer.start_link(__MODULE__, opts, name: __MODULE__)
  end

  @doc """
  Get the current supervisor state. Useful for testing and debugging.
  """
  @spec get_state() :: State.t()
  def get_state do
    GenServer.call(__MODULE__, :get_state)
  end

  # Server callbacks

  @impl true
  def init(_opts) do
    {:ok, supervisor} = Task.Supervisor.start_link()
    pid = self()

    shapes = [
      {:memberships, Threads.Membership},
      {:threads, Threads.Thread}
    ]

    tasks =
      shapes
      |> Enum.map(fn {key, shape} -> Consumer.start_async(supervisor, pid, key, shape) end)
      |> Enum.into(%{})

    state = %State{
      supervisor: supervisor,
      tasks: tasks,
      data: %{},
      pids: %{}
    }

    {:ok, state}
  end

  @impl true
  def handle_info({:DOWN, _ref, :process, pid, reason}, state) when pid in state.tasks do
    IO.puts("Task completed with reason: #{inspect(reason)}, #{Map.get(state.tasks, pid)}")

    # XXX Implement task restart logic
    raise "NotImplemented - need to wipe and restart pid"

    {:noreply, state}
  end

  def handle_info({:DOWN, _ref, :process, pid, reason}, %{pids: pids} = state) do
    case Map.pop(pids, pid) do
      {nil, _pids} ->
        {:noreply, state}

      {{agent_name, thread_id}, remaining_pids} ->
        {:ok, new_data, new_pids} = restart_agent(thread_id, agent_name, remaining_pids, state)

        {:noreply, %State{state | data: new_data, pids: new_pids}}
    end
  end

  @impl true
  def handle_call(:get_state, _from, state) do
    {:reply, state, state}
  end

  @impl true
  def handle_info({:stream, :memberships, []}, state), do: {:noreply, state}
  def handle_info({:stream, :memberships, messages}, %{data: data, pids: pids} = state) do
    # When a membership is deleted, stop the agent.
    {:ok, data, pids} =
      messages
      |> Enum.filter(&Messages.is_delete/1)
      |> Enum.map(&Messages.get_value/1)
      |> Enum.reduce(&stop_agent/2, {:ok, data, pids})

    # When a membership is inserted, start Sarah.
    {:ok, data, pids} =
      messages
      |> Enum.filter(&Messages.is_insert/1)
      |> Enum.map(&Messages.get_value/1)
      |> Enum.reduce(&start_agent/2, {:ok, data, pids})

    {:noreply, %State{state | data: data, pids: pids}}
  end

  @impl true
  def handle_info({:stream, :threads, []}, state), do: {:noreply, state}
  def handle_info({:stream, :threads, messages}, %{data: data, pids: pids} = state) do
    {:ok, data, pids} =
      messages
      |> Enum.filter(&Messages.is_delete/1)
      |> Enum.map(&Messages.get_value/1)
      |> Enum.reduce(&pop_and_stop_agents/2, {:ok, data, pids})

    {:noreply, %State{state | data: data, pids: pids}}
  end

  # Private functions

  defp start_agent(%Threads.Membership{} = membership, {:ok, data, pids}) do
    %{
      thread: %Threads.Thread{id: thread_id} = thread,
      user: %Accounts.User{name: user_name, type: user_type} = user
    } = Repo.preload(membership, [:thread, :user])

    case user_type do
      :human ->
        {:ok, data, pids}

      :agent ->
        agent_name = user_name
        agent_module = Map.fetch!(@agents, agent_name)

        {:ok, agent_pid} = agent_module.start_link(thread, user)

        Process.monitor(agent_pid)

        agents_map =
          data
          |> Map.get(thread_id, %{})
          |> Map.put(agent_name, agent_pid)

        new_data = Map.put(data, thread_id, agents_map)
        new_pids = Map.put(pids, agent_pid, {agent_name, thread_id})

        {:ok, new_data, new_pids}
    end
  end

  defp stop_agent(%Threads.Membership{thread_id: thread_id} = membership, {:ok, data, pids}) do
    %{
      user: %Accounts.User{
        name: user_name,
        type: user_type
      } = user
    } = Repo.preload(membership, :user)

    case user_type do
      :human ->
        {:ok, data, pids}

      :agent ->
        {agents_map, remaining_data} = Map.pop(data, thread_id, %{})
        {agent_pid, remaining_agents} = Map.pop(agents_map, user_name)

        case agent_pid do
          nil ->
            {:ok, data, pids}

          pid ->
            GenServer.stop(pid, :normal)

            new_data = Map.put(remaining_data, thread_id, remaining_agents)
            new_pids = Map.delete(pids, pid)

            {:ok, new_data, new_pids}
        end
    end
  end

  defp pop_and_stop_agents(%Threads.Thread{id: thread_id} = thread, {:ok, data, pids}) do
    with {agents_map, remaining_data} when not is_nil(agents_map) <- Map.pop(data, thread_id) do
      remaining_pids =
        agents_map
        |> Map.values()
        |> Enum.reduce(
          fn pid, pids ->
            GenServer.stop(pid, :normal)

            Map.delete(pids, pid)
          end,
          pids
        )

      {:ok, remaining_data, remaining_pids}

    else
      {nil, _data} ->
        {:ok, data, pids}
    end
  end

  defp restart_agent(thread_id, agent_name, remaining_pids, %{data: data} = state) do
    case Threads.get_membership_for(thread_id, agent_name) do
      nil ->
        {:ok, cleanup_agent(thread_id, agent_name, data), remaining_pids}

      %Threads.Membership{} = membership ->
        case start_agent(membership, {:ok, data, remaining_pids}) do
          {:ok, new_data, new_pids} ->
            {:ok, new_data, new_pids}

         {:error, reason} ->
           IO.puts("Failed to restart #{agent_name} in thread #{thread_id}: #{inspect(reason)}")

           {:ok, cleanup_agent(thread_id, agent_name, data), remaining_pids}
        end
    end
  end

  defp cleanup_agent(thread_id, agent_name, data) do
    data
    |> Map.get(thread_id, %{})
    |> Map.delete(agent_name)
    |> case do
      empty_map when map_size(empty_map) == 0 -> Map.delete(data, thread_id)
      agents_map -> Map.put(data, thread_id, agents_map)
    end
  end
end