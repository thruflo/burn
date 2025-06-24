defmodule Burn.Accounts do
  @moduledoc """
  The Accounts context.
  """

  import Ecto.Query, warn: false
  alias Burn.Repo

  alias Burn.Accounts.User
  alias Burn.Threads

  ## Database getters

  @doc """
  Gets a user by name.

  ## Examples

      iex> get_user_by_name("foo")
      %User{}

      iex> get_user_by_name("unknown")
      nil

  """
  def get_user_by_name(name) when is_binary(name) do
    Repo.get_by(User, name: name)
  end

  @doc """
  Gets a single user.

  Raises `Ecto.NoResultsError` if the User does not exist.

  ## Examples

      iex> get_user!(123)
      %User{}

      iex> get_user!(456)
      ** (Ecto.NoResultsError)

  """
  def get_user!(id), do: Repo.get!(User, id)

  @doc """
  Create a user.

  ## Examples

      iex> create_user(%{field: value})
      {:ok, %User{}}

      iex> create_user(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_user(attrs) do
    %User{}
    |> User.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Get or create a user. If creating, also create their first thread.

  ## Examples

      iex> get_or_create_user("existing")
      {:ok, %User{threads: [%Threads.Thread{}]}}

      iex> get_or_create_user("not_existing")
      {:ok, %User{threads: [%Threads.Thread{}]}}

  """
  def get_or_create_user(name) when is_binary(name) do
    Repo.transact(fn ->
      case get_user_by_name(name) do
        %User{} = user ->
          {:ok, user}

        nil ->
          bootstrap_user(name)
      end
    end)
  end

  def bootstrap_user(name) when is_binary(name) do
    with {:ok, user} = create_user(%{name: name}),
         {:ok, _thread} = Threads.create_new_thread(user) do
      {:ok, user}
    end
  end
end
