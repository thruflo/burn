defmodule Burn.Tools.AskUserAboutThemselves do
  use Burn.ToolSchema

  @name "ask_user_about_themselves"
  @description "Ask a user for information about themselves."

  @primary_key false
  embedded_schema do
    field :user, :string
  end

  def changeset(tool, attrs) do
    tool
    |> cast(attrs, [:user])
    |> validate_required([:user])
  end
end
