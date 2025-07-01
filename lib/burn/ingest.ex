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

  # When a new thread is created, record the user created event.
  def on_insert_thread(
        %Multi{} = multi,
        %Changeset{changes: %{id: thread_id}},
        %Writer.Context{} = context,
        %Accounts.User{id: user_id}
      ) do
    event = Threads.init_user_created_thread_event(thread_id, user_id, :human)
    key = Writer.operation_name(context, :user_created_thread_event)

    multi
    |> Multi.insert(key, event)
  end
end
