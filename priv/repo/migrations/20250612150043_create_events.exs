defmodule Burn.Repo.Migrations.CreateEvents do
  use Ecto.Migration

  def change do
    create table(:events, primary_key: false) do
      add :id, :binary_id, primary_key: true

      add :role, :string, null: false
      add :assistant, :string

      add :type, :string, null: false
      add :data, :map, null: false

      add :thread_id, references(:threads, on_delete: :delete_all, type: :binary_id), null: false
      add :user_id, references(:users, on_delete: :nilify_all, type: :binary_id)

      timestamps(type: :utc_datetime)
    end

    create index(:events, [:thread_id])
    create index(:events, [:user_id])
  end
end
