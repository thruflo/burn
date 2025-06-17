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
    Tools
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

  Don't be verbose.
  NEVER comment on the facts that you receive.
  NEVER make any jokes or observations.

  Be brief yet creative with your question. It should:
  - be no more than two sentances long
  - elicit information that you can (later) convert into facts

  The facts you elicit will be used (later) by other agents to
  base jokes on. Try to draw out information that will be good for this, e.g.
  - personal facts about who the user is and what kind of life they're leading
  - unique things about the user that make them different or special
  - things the user has done, are proud of, or might be embarassed by

  Try and get the user talking. Open questions are better than closed
  questions. Asking users to elaborate on or be more specific about their
  previous answers is fine. Bland is bad! You need to drill down until
  you get some grit in the oyster!

  Note that, when using this `ask_user_about_themselves` tool, you must
  only ask the user for information about themselves, not about other users.

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

  #{Agents.shared_system_rules()}
  """

  @tools [
    Tools.AskUserAboutThemselves,
    Tools.DoNothing,
    Tools.ExtractFacts
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
    |> GenServer.call(request, 30_000)
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
    {:ok, _result, state} = handle_instruct(state)

    {:noreply, state}
  end

  @impl true
  def handle_call(:instruct, _from, state) do
    {:ok, result, state} = handle_instruct(state)

    {:reply, result, state}
  end

  @impl true
  def handle_call(:get_state, _from, state) do
    {:reply, state, state}
  end

  defp handle_instruct(%{events: events, thread: thread} = state) do
    messages = Context.to_messages(events)

    {:ok, tool_call} = Agents.instruct(thread, messages, @system_prompt, @tools, @default_model)
    {:ok, events} = Agents.perform(thread, tool_call, agent_name())

    {:ok, {tool_call, events}, state}
  end
end
