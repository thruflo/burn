defmodule Burn.Context do
  @moduledoc """
  Optimise what goes in the LLM context window.
  """
  require Logger
  alias Burn.Threads

  @type message :: %{name: String.t(), data: map()}

  @spec to_messages([Threads.Event.t()]) :: [Burn.Message.t()]
  def to_messages([]), do: []
  def to_messages([%Threads.Event{} | _] = events) do
    Logger.warning("TODO: format events into messages as per the 12-factor guide.")

    events
    |> Enum.map(&to_message/1)
  end

  def to_message(%Threads.Event{data: data, role: role, type: type}) do
    %{role: role, content: [Map.put(data, :type, type)]}
  end
end
