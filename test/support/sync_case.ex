defmodule Burn.SyncCase do
  @moduledoc """
  This module defines the setup for tests that run against the database
  without sandbox mode and with working Electric sync.

  It provides a clean slate for each test by:

  - truncating tables
  - waiting for the replication slot to be consumed
  - wiping the Electric shape logs folder

  This ensures Electric and Phoenix.Sync process all events before any tests
  start and will re-create all shapes from scratch.
  """
  use ExUnit.CaseTemplate, async: false

  alias Burn.Threads
  alias Ecto.Adapters.SQL
  alias Electric.Connection.Manager
  alias Electric.Postgres.ReplicationClient

  @schemas [
    Threads.Event,
    Threads.Thread
  ]
  @slot_name "electric_slot_default"
  @stack_id "electric-embedded"
  @storage_dir "persistent"

  using do
    quote do
      alias Burn.Repo

      import Ecto
      import Ecto.Changeset
      import Ecto.Query

      import Burn.SyncCase
    end
  end

  setup_all do
    original_config = disable_database_sandbox()

    on_exit(fn ->
      with_suppressed_logs(&clean_slate/0)

      reenable_database_sandbox(original_config)
    end)

    :ok
  end

  setup _tags do
    with_suppressed_logs(&clean_slate/0)

    :ok
  end

  @doc """
  Creates a clean slate for testing by truncating tables,
  waiting for replication, and wiping shape logs.
  """
  def clean_slate(
        schemas \\ @schemas,
        slot_name \\ @slot_name,
        stack_id \\ @stack_id,
        storage_dir \\ @storage_dir
      ) do
    manager = disconnect_replication_client(stack_id)

    wipe_tables(schemas, slot_name)
    wipe_directory(storage_dir)

    reconnect_replication_client(manager)
  end

  @doc """
  Helper to manually trigger a clean slate with specific schemas.
  Useful for tests that need to clean different sets of tables.
  """
  def reset_with_schemas(schemas) do
    clean_slate(schemas)
  end

  @doc """
  Temporarily disconnect replication client whilst performing
  jiggery on the replication slot.

  Sets the backoff so the ConnectionManager reconnects faster than
  the 2_000ms default, which is a bit of a wait between tests.
  """
  def disconnect_replication_client(stack_id) when is_binary(stack_id) do
    manager = Manager.name(stack_id)
    state = :sys.get_state(manager)

    faster_backoff = Manager.ConnectionBackoff.init(50, 4_000)
    new_state = %{state | connection_backoff: {faster_backoff, nil}}
    :sys.replace_state(manager, fn _old_state -> new_state end)

    try do
      ReplicationClient.stop(state.replication_client_pid, :normal)
    catch
      :exit, _ -> :pass
    end

    manager
  end

  def reconnect_replication_client(manager) do
    :ok = wait_until_streaming(manager, 0)
  end

  defp wait_until_streaming(manager, retries, max_retries \\ 400) do
    Process.sleep(10)

    case :sys.get_state(manager) do
      %{current_step: :streaming} ->
        :ok

      _alt ->
        if retries < max_retries do
          wait_until_streaming(manager, retries + 1)
        else
          {:error, :timeout}
        end
    end
  end

  @doc """
  Wipes tables for the given Ecto schema modules.
  """
  def wipe_tables([], _, _), do: :pass

  def wipe_tables(schemas, slot_name) when is_list(schemas) and is_binary(slot_name) do
    tables = Enum.map(schemas, fn mod -> mod.__schema__(:source) end)

    Burn.Repo.transaction(fn ->
      # "Truncate" the tables.
      for table <- tables do
        SQL.query!(Burn.Repo, "DELETE FROM #{table} WHERE TRUE;")
      end

      # Advance the replication slot.
      SQL.query!(Burn.Repo, """
        SELECT pg_replication_slot_advance('#{slot_name}', pg_current_wal_lsn());
      """)

      # IO.inspect {:after, replication_slot_status(slot_name)}
    end)
  end

  @doc """
  Wipes the storage directory with retry logic for handling file system locks.
  Retries every 10ms for up to 500ms if the directory is in use.
  """
  def wipe_directory(path) when is_binary(path) do
    if File.exists?(path) do
      wipe_with_retry(path, 0, 500)
      File.mkdir_p!(path)
    end
  end

  defp wipe_with_retry(path, elapsed_ms, max_wait_ms) when elapsed_ms >= max_wait_ms do
    # Final attempt - let it raise if it still fails
    File.rm_rf!(path)
  end

  defp wipe_with_retry(path, elapsed_ms, max_wait_ms) do
    try do
      File.rm_rf!(path)
    rescue
      # Catch file system errors (permission denied, file in use, etc.)
      File.Error ->
        Process.sleep(10)
        wipe_with_retry(path, elapsed_ms + 10, max_wait_ms)
    end
  end

  @doc """
  Helper to check replication slot status for debugging.
  """
  def replication_slot_status(slot_name \\ @slot_name) do
    {:ok, result} =
      SQL.query(
        Burn.Repo,
        """
          SELECT
            confirmed_flush_lsn,
            pg_wal_lsn_diff(pg_current_wal_lsn(), confirmed_flush_lsn) as bytes_lag
          FROM pg_replication_slots
          WHERE slot_type = 'logical'
            AND slot_name = '#{slot_name}';
        """
      )

    result.rows
  end

  @doc """
  Helper for asserting that a function will return
  a truthy value eventually within a given time frame.

  From https://peterullrich.com/async-testing-with-eventually
  """
  def assert_eventually(fun, timeout \\ 1_000, interval \\ 10)

  def assert_eventually(_fun, timeout, _interval) when timeout <= 0 do
    raise ExUnit.AssertionError, "Failed to receive a truthy result before timeout."
  end

  def assert_eventually(fun, timeout, interval) do
    result = fun.()

    ExUnit.Assertions.assert(result)

    result
  rescue
    ExUnit.AssertionError ->
      Process.sleep(interval)

      assert_eventually(fun, timeout - interval, interval)
  end

  defp disable_database_sandbox do
    original_config = Application.get_env(:burn, Burn.Repo)

    Application.put_env(
      :burn,
      Burn.Repo,
      original_config
      |> Keyword.put(:pool, DBConnection.ConnectionPool)
      |> Keyword.put(:pool_size, 10)
    )

    Supervisor.terminate_child(Burn.Supervisor, Burn.Repo)
    Supervisor.restart_child(Burn.Supervisor, Burn.Repo)

    original_config
  end

  defp reenable_database_sandbox(original_config) do
    Application.put_env(:burn, Burn.Repo, original_config)

    Supervisor.terminate_child(Burn.Supervisor, Burn.Repo)
    Supervisor.restart_child(Burn.Supervisor, Burn.Repo)
  end

  defp with_suppressed_logs(level \\ :critical, fun) do
    original_level = Logger.level()
    Logger.configure(level: level)

    try do
      fun.()
    after
      Logger.configure(level: original_level)
    end
  end
end
