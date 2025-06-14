defmodule Burn.ToolResponse do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key false
  embedded_schema do
    field :id, :string
    field :input, :map
    field :name, :string
  end

  def validate(attrs, tool_modules) do
    %__MODULE__{}
    |> changeset(attrs, tool_modules)
  end

  def changeset(tool_response, attrs, tool_modules) do
    tool_response
    |> cast(attrs, [:id, :input, :name])
    |> validate_required([:id, :input, :name])
    |> validate_length(:name, min: 1, max: 200)
    |> validate_tool(tool_modules)
  end

  defp validate_tool(changeset, tool_modules) do
    name = get_field(changeset, :name)

    case Enum.find(tool_modules, fn mod -> mod.name() == name end) do
      nil ->
        changeset
        |> add_error(:name, "tool not found: #{name}")

      tool_module ->
        changeset
        |> validate_input(tool_module)
    end
  end

  defp validate_input(changeset, tool_module) do
    input = get_field(changeset, :input)
    schema = struct(tool_module)

    case tool_module.changeset(schema, input) do
      %{valid?: true} ->
        changeset

      %{errors: errors} ->
        error_message =
          errors
          |> Enum.map(fn {field, {msg, _}} -> "#{field}: #{msg}" end)
          |> Enum.join("; ")

        changeset
        |> add_error(:input, "validation failed: #{error_message}")
    end
  end
end
