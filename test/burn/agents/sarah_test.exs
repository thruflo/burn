defmodule Burn.Agents.SarahTest do
  use Burn.SyncCase

  import Burn.{
    AccountsFixtures,
    ThreadsFixtures
  }

  alias Burn.{
    Agents,
    Memory,
    Threads,
    ToolCall
  }

  describe "sarah" do
    alias Agents.Sarah
    alias Agents.Sarah.State

    setup do
      thread = thread_fixture()
      user = user_fixture()
      membership = membership_fixture(thread, user)

      {:ok, _pid} = Sarah.start_link(thread, :manual)

      %{thread: thread, user: user, membership: membership}
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

    test "subscribes to memberships", %{thread: thread, user: %{id: user_id}} do
      assert_eventually(fn ->
        assert %State{users: [%{id: ^user_id}]} = Sarah.get_state(thread)
      end)
    end

    test "defaults to doing nothing", %{thread: thread} do
      {nil, %{}} = Sarah.instruct(thread)
    end

    test "asks the user for information", %{thread: thread, user: %{id: user_id} = user} do
      %Threads.Event{id: event_id} = user_joined_event_fixture(thread, user)

      assert_eventually(fn ->
        assert %State{events: [%{id: ^event_id}]} = Sarah.get_state(thread)
      end)

      {%ToolCall{id: tool_use_id, input: %{"subject" => ^user_id}}, _} = Sarah.instruct(thread)

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

    test "extracts facts to be stored", %{thread: thread, user: %{id: user_id} = user} do
      %Threads.Event{} =
        user_joined_event_fixture(thread, user)

      %Threads.Event{} =
        ask_user_about_themselves_fixture(thread, user)

      %Threads.Event{id: event_id} =
        user_provides_information_fixture(thread, user)

      assert_eventually(fn ->
        %State{events: events} = Sarah.get_state(thread)
        assert %{id: ^event_id} = Enum.at(events, -1)
      end)

      {%ToolCall{id: tool_use_id, name: "extract_facts"}, _} = Sarah.instruct(thread)

      assert_eventually(fn ->
        %State{events: events} = Sarah.get_state(thread)
        assert %{type: :tool_use, data: %{"id" => ^tool_use_id}} = Enum.at(events, -1)
      end)

      assert [
        %Burn.Memory.Fact{
          source_event_id: ^event_id,
          subject_id: ^user_id,
          object: "horse riding",
          disputed: false
        },
        %Burn.Memory.Fact{
          source_event_id: ^event_id,
          subject_id: ^user_id,
          object: "biscuits",
          disputed: false
        }
      ] = Memory.list_facts()
    end
  end
end
