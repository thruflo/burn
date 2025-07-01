defmodule BurnWeb.IngestController do
  use BurnWeb, :controller

  alias Burn.{
    Ingest,
    Repo,
    Threads
  }

  alias Phoenix.Sync.Writer
  alias Writer.Format

  # XXX todo: authorize writes
  def ingest(%{assigns: %{current_user: user}} = conn, %{"mutations" => mutations}) do
    {:ok, txid, _changes} =
      Writer.new()
      |> Writer.allow(Threads.Event)
      |> Writer.allow(Threads.Membership)
      |> Writer.allow(
        Threads.Thread,
        insert: [
          # N.b.: passing the current `user` as an argument implicitly
          # assumes that the current user is the thread owner.
          post_apply: &Ingest.on_insert_thread(&1, &2, &3, user)
        ]
      )
      |> Writer.apply(mutations, Repo, format: Format.TanstackDB)

    json(conn, %{txid: Integer.to_string(txid)})
  end
end
