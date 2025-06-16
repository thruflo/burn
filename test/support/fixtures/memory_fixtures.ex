defmodule Burn.MemoryFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `Burn.Memory` context.
  """

  alias Burn.{
    Accounts,
    Memory,
    Threads
  }

  @doc """
  Generate a fact.
  """
  def fact_fixture(
        %Threads.Thread{} = thread,
        %Threads.Event{} = source_event,
        %Accounts.User{} = subject,
        attrs \\ %{}
      ) do
    attrs = Enum.into(attrs, %{
      predicate: "works_as",
      object: "software_developer",
      category: "work",
      confidence: "0.9",
      disputed: false
    })

    {:ok, fact} = Memory.create_fact(thread, source_event, subject, attrs)

    fact
  end
end
