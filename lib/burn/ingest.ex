defmodule Burn.Ingest do
  @moduledoc """
  Ingest specific validation and event handling functions.
  """

  alias Burn.{
    Accounts,
    Threads
  }

  alias Ecto.{
    Changeset,
    Multi
  }

  alias Phoenix.Sync.Writer

  # When a new thread is created:
  # - record the user created event
  # - add Sarah and Frankie to the thread
  def on_insert_thread(
        %Multi{} = multi,
        %Changeset{changes: %{id: thread_id}},
        %Writer.Context{} = context,
        %Accounts.User{id: user_id, type: user_type}
      ) do
    event = Threads.init_user_thread_event(thread_id, user_id, user_type, :created)
    event_key = Writer.operation_name(context, :user_created_thread_event)

    sarah_membership = Accounts.init_agent_membership(thread_id, "sarah", :producer)
    sarah_membership_key = Writer.operation_name(context, :sarah_thread_membership)

    frankie_membership = Accounts.init_agent_membership(thread_id, "frankie", :comedian)
    frankie_membership_key = Writer.operation_name(context, :frankie_thread_membership)

    multi
    |> Multi.insert(event_key, event)
    |> Multi.insert(sarah_membership_key, sarah_membership)
    |> Multi.insert(frankie_membership_key, frankie_membership)
  end

  # When a users joins a thread:
  # - record the user joined event
  def on_insert_membership(
        %Multi{} = multi,
        %Changeset{changes: %{role: role, thread_id: thread_id, user_id: user_id}},
        %Writer.Context{} = context,
        %Accounts.User{id: current_user_id, type: user_type}
      ) do
    case {role, user_id} do
      {:member, ^current_user_id} ->
        event = Threads.init_user_thread_event(thread_id, user_id, user_type, :joined)
        event_key = Writer.operation_name(context, :user_joined_thread_event)

        multi
        |> Multi.insert(event_key, event)

      {_role, _user_id} ->
        multi
    end
  end
end
