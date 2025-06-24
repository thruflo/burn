defmodule Burn.AccountsFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `Burn.Accounts` context.
  """

  def random_suffix, do: :crypto.strong_rand_bytes(7) |> Base.encode16(case: :lower)
  def unique_user_name, do: "u#{random_suffix()}"

  def valid_user_attributes(attrs \\ %{}) do
    Enum.into(attrs, %{
      name: unique_user_name()
    })
  end

  def user_fixture(attrs \\ %{}) do
    {:ok, user} =
      attrs
      |> valid_user_attributes()
      |> Burn.Accounts.create_user()

    user
  end
end
