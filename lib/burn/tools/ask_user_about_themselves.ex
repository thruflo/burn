defmodule Burn.Tools.AskUserAboutThemselves do
  use Burn.Tool

  @name "ask_user_about_themselves"
  @description """
    Ask a user for information about themselves.

    The `subject` is the ID of the user that you're asking.
    The `question` is the question that you're asking them.

    Be brief yet creative with your question. It should:
    - be no more than two sentances long
    - elicit information that you can (later) convert into facts

    The facts you elicit will be used (later) by other agents to
    base jokes on. Try to draw out information that will be good for this, e.g.
    - personal facts about who the user is and what kind of life they're leading
    - unique things about the user that make them different or special
    - things the user has done, are proud of, or might be embarassed by

    Try and get the user talking. Open questions are better than closed
    questions. Asking users to elaborate on or be more specific about their
    previous answers is fine. Bland is bad! You need to drill down until
    you get some grit in the oyster!

    Note that, when using this `ask_user_about_themselves` tool, you must
    only ask the user for information about themselves, not about other users.
  """

  @primary_key false
  embedded_schema do
    field :subject, :binary_id
    field :question, :string
  end

  def validate(%ToolCall{thread_id: thread_id}, tool, attrs) do
    tool
    |> cast(attrs, [:subject, :question])
    |> validate_required([:subject, :question])
    |> ToolCall.validate_user_in_thread(:subject, thread_id)
  end
end
