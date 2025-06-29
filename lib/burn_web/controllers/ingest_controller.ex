defmodule BurnWeb.IngestController do
  use BurnWeb, :controller

  alias Burn.{
    Repo,
    Threads
  }

  alias Phoenix.Sync.Writer
  alias Writer.Format

  # XXX todo: authorize writes
  def ingest(conn, %{"mutations" => mutations}) do
    {:ok, txid, _changes} =
      Writer.new()
      |> Writer.allow(Threads.Event)
      |> Writer.allow(Threads.Thread)
      |> Writer.allow(Threads.Membership)
      |> Writer.apply(mutations, Repo, format: Format.TanstackDB)

    json(conn, %{txid: Integer.to_string(txid)})
  end
end
