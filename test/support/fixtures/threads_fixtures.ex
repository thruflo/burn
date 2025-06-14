defmodule Burn.ThreadsFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `Burn.Threads` context.
  """

  alias Burn.Accounts
  alias Burn.Threads

  @doc """
  Generate a thread.
  """
  def thread_fixture(attrs \\ %{}) do
    {:ok, thread} =
      attrs
      |> Enum.into(%{
        name: "some name",
        status: :pending
      })
      |> Threads.create_thread()

    thread
  end

  @doc """
  Generate a event.
  """
  def event_fixture(%Threads.Thread{} = thread, attrs \\ %{}) do
    {:ok, event} =
      Threads.create_event(
        thread,
        Enum.into(
          attrs,
          %{
            role: :assistant,
            assistant: :sarah,
            type: :text,
            data: %{
              "text" => "Lorem ipsum"
            }
          }
        )
      )

    event
  end

  @doc """
  Generate a membership.
  """
  def membership_fixture(%Threads.Thread{} = thread, %Accounts.User{} = user) do
    {:ok, membership} = Burn.Threads.create_membership(thread, user)

    membership
  end
end
