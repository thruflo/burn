defmodule Burn.Agents.SarahTest do
  use Burn.SyncCase

  import Burn.AccountsFixtures
  import Burn.ThreadsFixtures

  alias Burn.Agents
  alias Burn.Threads
  alias Burn.ToolResponse

  describe "sarah" do
    alias Agents.Sarah
    alias Agents.Sarah.State

    setup do
      thread = thread_fixture()
      user = user_fixture()

      {:ok, _pid} = Sarah.start_link(thread, :manual)

      %{thread: thread, user: user}
    end

    test "initializes state", %{thread: %{id: thread_id} = thread} do
      assert %State{thread: %{id: ^thread_id}} = Sarah.get_state(thread)
    end

    test "subscribes to its thread", %{thread: thread} do
      assert %State{thread: ^thread} = Sarah.get_state(thread)
      assert %{name: "some name"} = thread

      {:ok, thread} = Threads.update_thread(thread, %{name: "some other name"})

      assert_eventually(fn ->
        assert %State{thread: %{name: "some other name"}} = Sarah.get_state(thread)
      end)
    end

    test "subscribes to events", %{thread: thread} do
      assert %State{events: []} = Sarah.get_state(thread)

      %{id: event_id} = event_fixture(thread)

      assert_eventually(fn ->
        assert %State{events: [%{id: ^event_id}]} = Sarah.get_state(thread)
      end)
    end

    test "subscribes to memberships", %{thread: thread, user: %{id: user_id} = user} do
      assert %State{users: []} = Sarah.get_state(thread)

      {:ok, _membership} = Threads.create_membership(thread, user)

      assert_eventually(fn ->
        assert %State{users: [%{id: ^user_id}]} = Sarah.get_state(thread)
      end)
    end

    test "defaults to doing nothing", %{thread: thread} do
      nil = Sarah.instruct(thread)
    end

    test "asks the user for information", %{thread: thread, user: %{email: email} = user} do
      {:ok, %{id: event_id}} =
        Threads.create_event(thread, %{
          role: :user,
          user: user,
          type: :text,
          data: %{
            "text" => "User #{email} joined the thread!"
          }
        })

      assert_eventually(fn ->
        assert %State{events: [%{id: ^event_id}]} = Sarah.get_state(thread)
      end)

      %ToolResponse{id: tool_use_id, input: %{"user" => ^email}} = Sarah.instruct(thread)

      assert_eventually(fn ->
        %State{events: events} = Sarah.get_state(thread)
        assert %{
          role: :assistant,
          assistant: :sarah,
          type: :tool_use,
          data: %{
            "id" => ^tool_use_id
          }
        } = Enum.at(events, -1)
      end)
    end
  end
end
