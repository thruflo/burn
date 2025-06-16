defmodule Burn.Memory.Fact do
  use Ecto.Schema
  import Ecto.Changeset

  alias Burn.Accounts
  alias Burn.Threads

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "facts" do
    belongs_to :thread, Threads.Thread
    belongs_to :source_event, Threads.Event
    belongs_to :subject, Accounts.User

    field :predicate, :string
    field :object, :string
    field :category, :string
    field :confidence, :decimal
    field :disputed, :boolean

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(fact, attrs) do
    fact
    |> cast(attrs, [
      :id,
      :thread_id,
      :source_event_id,
      :subject_id,
      :predicate,
      :object,
      :category,
      :confidence,
      :disputed
    ])
    |> validate_required([:predicate, :object, :category])
    |> validate_number(:confidence,
      greater_than: Decimal.new("0.0"),
      less_than_or_equal_to: Decimal.new("1.0")
    )
    |> assoc_constraint(:thread)
    |> assoc_constraint(:source_event)
    |> assoc_constraint(:subject)
  end
end
