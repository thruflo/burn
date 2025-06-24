defmodule Burn.Accounts.User do
  use Ecto.Schema
  import Ecto.Changeset

  alias Burn.Threads

  @derive {Jason.Encoder, only: [:id, :name]}
  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "users" do
    field :name, :string

    many_to_many :threads, Threads.Thread, join_through: Threads.Membership

    timestamps(type: :utc_datetime)
  end

  def changeset(user, attrs) do
    user
    |> cast(attrs, [:name])
    |> validate_required([:name])
    |> validate_length(:name, min: 2, max: 16)
    |> validate_format(:name, ~r/^[\w-]+$/)
    |> unique_constraint(:name)
  end
end
