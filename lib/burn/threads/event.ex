defmodule Burn.Threads.Event do
  # XXX so ... you need to change this to capture the info
  # necessary to represent messages.

  # Messages need `role` and `content`. The Context module can
  # extend the way we format events. But we need:
  #
  # 1. to be able to convert tool use results into events
  # 2. and convert user events like natural messages and test messages
  # 3. and then we need to represent these out again in the format context window step
  #
  # The API spec is kinda here: https://docs.anthropic.com/en/api/messages

  use Ecto.Schema
  import Ecto.Changeset

  alias Burn.Accounts
  alias Burn.Agents
  alias Burn.Threads

  defmodule TextData do
    use Ecto.Schema

    @primary_key false
    embedded_schema do
      field :text, :string
    end

    def changeset(text_data, attrs) do
      text_data
      |> cast(attrs, [:text])
      |> validate_required([:text])
    end
  end

  defmodule ToolUseData do
    use Ecto.Schema

    @primary_key false
    embedded_schema do
      field :id, :string
      field :input, :map
      field :name, :string
    end

    def changeset(text_data, attrs) do
      text_data
      |> cast(attrs, [:id, :input, :name])
      |> validate_required([:id, :input, :name])
      |> validate_length(:name, min: 1, max: 200)
    end
  end

  defmodule ToolResultData do
    use Ecto.Schema

    @primary_key false
    embedded_schema do
      field :content, :string
      field :is_error, :boolean
      field :tool_use_id, :string
    end

    def changeset(text_data, attrs) do
      text_data
      |> cast(attrs, [:content, :is_error, :tool_use_id])
      |> validate_required([:content, :is_error, :tool_use_id])
    end
  end

  @agent_names [
    Agents.Sarah.agent_name(),
    # ...
  ]

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "events" do
    field :role, Ecto.Enum, values: [:assistant, :user] # required
    field :assistant, Ecto.Enum, values: @agent_names # optional, required if role is :assistant

    field :type, Ecto.Enum, values: [:text, :tool_use, :tool_result] # required, :image, :document
    field :data, :map # required, conditional validation

    belongs_to :thread, Threads.Thread
    belongs_to :user, Accounts.User # optional, required if role is :user

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(event, attrs) do
    event
    |> cast(attrs, [:id, :assistant, :data, :role, :type, :thread_id, :user_id])
    |> validate_required([:data, :role, :type])
    |> assoc_constraint(:thread)
    |> validate_role()
    |> validate_type()
  end

  defp validate_role(changeset) do
    role = get_field(changeset, :role)

    case role do
      :assistant ->
        changeset
        |> validate_required(:assistant)

      :user ->
        changeset
        |> assoc_constraint(:user)

      _alt ->
        changeset
        |> add_error(:role, "unable to perform conditional validation")
    end
  end

  defp validate_type(changeset) do
    type = get_field(changeset, :type)

    schema_module =
      case type do
        :text -> TextData
        :tool_use -> ToolUseData
        :tool_result -> ToolResultData
        _alt -> nil
      end

    changeset
    |> validate_data(schema_module)
  end

  defp validate_data(changeset, nil) do
    changeset
    |> add_error(:data, "unable to perform conditional validation")
  end
  defp validate_data(changeset, schema_module) do
    data = get_field(changeset, :data)
    schema = struct(schema_module)

    case schema_module.changeset(schema, data) do
      %{valid?: true} ->
        changeset

      %{errors: errors} ->
        error_message =
          errors
          |> Enum.map(fn {field, {msg, _}} -> "#{field}: #{msg}" end)
          |> Enum.join("; ")

        changeset
        |> add_error(:data, "validation failed: #{error_message}")
    end
  end
end
