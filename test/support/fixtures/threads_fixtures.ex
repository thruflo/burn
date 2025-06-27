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
        status: :started
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

  def user_joined_event_fixture(%Threads.Thread{} = thread, %Accounts.User{id: user_id}) do
    {:ok, event} =
      Threads.create_event(thread, %{
        role: :user,
        user_id: user_id,
        type: :text,
        data: %{
          "text" => "User joined the thread!"
        }
      })

    event
  end

  def ask_user_about_themselves_fixture(%Threads.Thread{} = thread, %Accounts.User{id: user_id}) do
    tool_use_id = Ecto.UUID.generate()

    {:ok, event} =
      Threads.create_event(thread, %{
        role: :assistant,
        assistant: :sarah,
        type: :tool_use,
        data: %{
          "id" => tool_use_id,
          "input" => %{
            "subject" => user_id,
            "question" => "What's something unique or interesting about yourself?"
          },
          "name" => "ask_user_about_themselves"
        }
      })

    event
  end

  def user_provides_information_fixture(%Threads.Thread{} = thread, %Accounts.User{id: user_id}) do
    {:ok, event} =
      Threads.create_event(thread, %{
        role: :user,
        user_id: user_id,
        type: :text,
        data: %{
          "text" => "I like horse riding and I hate biscuits"
        }
      })

    event
  end
end
