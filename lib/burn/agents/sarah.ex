defmodule Burn.Agents.Sarah do
  use GenServer

  alias Burn.{
    # Accounts,
    Agents,
    Consumer,
    Context,
    Messages,
    Repo,
    Shapes,
    Threads,
    Tools,
    ToolResponse
  }

  @type next_step ::
          {:ok, Ecto.Schema.t()}
          | {:error, Ecto.Changeset.t()}
          | {:error, any()}
          | {:error, atom(), any()}

  @default_model :sonnet
  @system_prompt """
    As a genius, expert BBC research / production assistant, you must collect
    facts about the users that you're talking to.

    Assume a neutral, professional tone and personality.
    Your job is only to collect and extract facts when appropriate.

    NEVER comment on the facts that you receive.
    NEVER make any jokes or observations.

    If there are no users
    => do nothing

    If a user asks to be burned
    => do nothing

    If a user asks for another user to be burned
    => do nothing

    If a user provides information about themselves
    => extract out the facts

    If a user provides information about another user
    => ask the other user whether the information about them is true

    If a user confirms, denies or revises information about themselves
    => extract out the facts

    Otherwise collect facts:
    => either ask a user for information about themselves
    => or ask a user what they know about another user

  """

  @tools [
    Tools.AskUserAboutThemselves,
    Tools.DoNothing
  ]

  def agent_name, do: :sarah

  defmodule State do
    defstruct [
      # Internal
      :supervisor,
      :tasks,
      :mode,

      # Data
      :events,
      :thread,
      :users
    ]
  end

  # Client

  @spec start_link(Threads.Thread.t()) :: GenServer.on_start()
  def start_link(%Threads.Thread{} = thread, mode \\ :auto) do
    GenServer.start_link(__MODULE__, {thread, mode}, name: process_name(thread))
  end

  @doc """
  Given the current state, determine what to do next.
  """
  @spec instruct(Threads.Thread.t()) :: next_step()
  def instruct(%Threads.Thread{} = thread) do
    call_thread(thread, :instruct)
  end

  @doc """
  Get the current state. Useful for testing.
  """
  @spec get_state(Threads.Thread.t()) :: State.t()
  def get_state(%Threads.Thread{} = thread) do
    call_thread(thread, :get_state)
  end

  @doc """
  Get the process name for a thread. Useful for testing.
  """
  def process_name(%Threads.Thread{id: thread_id}) do
    {:via, Registry, {Agents, {__MODULE__, thread_id}}}
  end

  defp call_thread(%Threads.Thread{} = thread, request) do
    thread
    |> process_name()
    |> GenServer.call(request)
  end

  # Server

  @impl true
  def init({%Threads.Thread{} = thread, mode}) do
    {:ok, supervisor} = Task.Supervisor.start_link()
    pid = self()

    shapes = [
      {:events, Shapes.events(thread)},
      {:memberships, Shapes.memberships(thread)},
      {:thread, Shapes.thread(thread)}
    ]

    tasks =
      shapes
      |> Enum.map(fn {key, shape} -> Consumer.start_async(supervisor, pid, key, shape) end)
      |> Enum.into(%{})

    state = %State{
      supervisor: supervisor,
      tasks: tasks,
      mode: mode,
      thread: thread,
      users: [],
      events: []
    }

    {:ok, state}
  end

  @impl true
  def handle_info({:stream, :thread, []}, state), do: {:noreply, state}

  def handle_info({:stream, :thread, _messages}, %{thread: %{id: thread_id}} = state) do
    {:noreply, %{state | thread: Threads.get_thread!(thread_id)}}
  end

  @impl true
  def handle_info({:stream, :events, []}, state), do: {:noreply, state}

  def handle_info({:stream, :events, messages}, %{events: events, mode: mode} = state) do
    messages
    |> Enum.filter(&Messages.is_insert/1)
    |> Enum.map(&Messages.get_value/1)
    |> case do
      [] ->
        {:noreply, state}

      new_events ->
        if mode == :auto do
          Process.send(self(), :instruct, [])
        end

        {:noreply, %State{state | events: events ++ new_events}}
    end
  end

  @impl true
  def handle_info({:stream, :memberships, []}, state), do: {:noreply, state}

  def handle_info({:stream, :memberships, _messages}, %{thread: thread} = state) do
    %{users: users} = Repo.preload(thread, :users)

    {:noreply, %State{state | users: users}}
  end

  @impl true
  def handle_info({:DOWN, _ref, :process, task_pid, reason}, %{tasks: tasks} = state) do
    IO.puts("Task completed with reason: #{inspect(reason)}, #{Map.get(tasks, task_pid)}")

    raise "NotImplemented - need to wipe and restart pid"

    {:noreply, state}
  end

  @impl true
  def handle_info(:instruct, state) do
    {:ok, _result, state} = determine_next_step(state)

    {:noreply, state}
  end

  @impl true
  def handle_call(:instruct, _from, state) do
    {:ok, result, state} = determine_next_step(state)

    {:reply, result, state}
  end

  @impl true
  def handle_call(:get_state, _from, state) do
    {:reply, state, state}
  end

  defp determine_next_step(%{events: events, thread: thread} = state) do
    # IO.inspect({:determine_next_step, events})

    {:ok, tool_response} =
      Context.to_messages(events)
      |> Agents.instruct(@system_prompt, @tools, @default_model)

    # IO.inspect({:tool_response, tool_response})

    case tool_response do
      nil ->
        {:ok, tool_response, state}

      %ToolResponse{name: "do_nothing"} ->
        {:ok, tool_response, state}

      %ToolResponse{} ->
        # Record the event in the DB before returning the result.
        {:ok, _event} = Threads.create_event(thread, %{
          role: :assistant,
          assistant: agent_name(),
          type: :tool_use,
          data: Map.from_struct(tool_response)
        })

        # No need to update the state because the state is subcribed to the
        # Electric stream and automatically picks up on all new events.
        #
        # XXX we can short-cut this and make sure the event is in the state.
        # But this requires a bit of merge faffery, so need to experiment
        # with the control flow first.
        {:ok, tool_response, state}
    end
  end
end
