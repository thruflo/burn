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
  # - add Sarah to the thread
  def on_insert_thread(
        %Multi{} = multi,
        %Changeset{changes: %{id: thread_id}},
        %Writer.Context{} = context,
        %Accounts.User{id: user_id}
      ) do
    event = Threads.init_user_created_thread_event(thread_id, user_id, :human)
    event_key = Writer.operation_name(context, :user_created_thread_event)

    membership = Accounts.init_sarah_membership(thread_id)
    membership_key = Writer.operation_name(context, :sarah_thread_membership)

    multi
    |> Multi.insert(event_key, event)
    |> Multi.insert(membership_key, membership)
  end
end
