defmodule Burn.Agents do
  alias Burn.Context
  alias Burn.ToolResponse

  alias Ecto.Changeset

  alias InstructorLite.ErrorFormatter

  @default_adapter Burn.Adapters.Anthropic
  @max_retries 3

  @doc """
  Perform instruction session.
  """
  @spec instruct([Context.message()], binary(), [atom()], atom(), keyword()) ::
          {:ok, ToolResponse.t() | nil}
          | {:error, Changeset.t()}
          | {:error, any()}
          | {:error, atom(), any()}
  def instruct(messages, system, tools, model, opts \\ [])
  def instruct([], _system, _tools, _model, _opts), do: {:ok, nil}
  def instruct(messages, system, tools, model, opts) do
    adapter = Keyword.get(opts, :adapter, @default_adapter)
    max_retries = Keyword.get(opts, :max_retries, @max_retries)

    messages
    |> adapter.initial_prompt(system, tools, model)
    |> do_instruct(adapter, tools, max_retries)
  end

  defp do_instruct(params, adapter, tools, retries) do
    {:ok, payload} = adapter.send_request(params)
    {:ok, response} = adapter.parse_response(payload)

    case ToolResponse.validate(response, tools) do
      %Changeset{valid?: true} = changeset ->
        {:ok, Changeset.apply_changes(changeset)}

      {:error, %Changeset{} = changeset} ->
        if retries > 0 do
          errors = ErrorFormatter.format_errors(changeset)
          new_params = adapter.retry_prompt(params, errors, response)

          do_instruct(new_params, adapter, tools, retries - 1)
        else
          {:error, changeset}
        end

      error ->
        error
    end
  end
end
