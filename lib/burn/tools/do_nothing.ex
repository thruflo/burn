defmodule Burn.Tools.DoNothing do
  use Burn.ToolSchema

  @name "do_nothing"
  @description "Do nothing."

  @primary_key false
  embedded_schema do
  end

  def changeset(tool, attrs) do
    tool
    |> cast(attrs, [])
  end
end
