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
  Gets a single user.

  ## Examples

      iex> get_user(123)
      %User{}

      iex> get_user(456)
      nil

  """
  def get_user(id), do: Repo.get(User, id)

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

  def init_user(attrs) do
    %User{}
    |> User.changeset(attrs)
  end

  @doc """
  Create a user.

  ## Examples

      iex> create_user(%{field: value})
      {:ok, %User{}}

      iex> create_user(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_user(attrs) do
    init_user(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a user.

  ## Examples

      iex> update_user(user, %{field: new_value})
      {:ok, %User{}}

      iex> update_user(user, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_user(%User{} = user, attrs) do
    user
    |> User.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Gets a user by name.

  ## Examples

      iex> get_human_user_by_name("foo")
      %User{}

      iex> get_human_user_by_name("unknown")
      nil

  """
  def get_human_user_by_name(name) when is_binary(name) do
    Repo.get_by(User, name: name, type: :human)
  end

  def get_agent_by_name(name) when is_binary(name) do
    Repo.get_by(User, name: name, type: :agent)
  end

  @doc """
  Get or create a user. If creating, also create their first thread.

  ## Examples

      iex> get_or_create_human_user("existing")
      {:ok, %User{threads: [%Threads.Thread{}]}}

      iex> get_or_create_human_user("not_existing", nil)
      {:ok, %User{threads: [%Threads.Thread{}]}}

      iex> get_or_create_human_user("existing", "https://github.com/thruflo.png?size=120")
      {:ok, %User{avatar_url: "https://github.com/thruflo.png?size=120"}

      iex> get_or_create_human_user("existing", "invalid")
      {:error, %Ecto.Changeset{}}

  """
  def get_or_create_human_user(name, avatar_url \\ nil) when is_binary(name) do
    Repo.transact(fn ->
      case get_human_user_by_name(name) do
        %User{avatar_url: existing_avatar_url} = user
        when is_nil(avatar_url) or avatar_url == existing_avatar_url ->
          {:ok, user}

        %User{} = user ->
          update_user(user, %{avatar_url: avatar_url})

        nil ->
          bootstrap_human_user(name, avatar_url)
      end
    end)
  end

  def bootstrap_human_user(name, avatar_url \\ nil) when is_binary(name) do
    attrs = %{
      type: :human,
      name: name,
      avatar_url: avatar_url
    }

    with {:ok, user} = create_user(attrs),
         {:ok, thread} = Threads.create_new_thread(user),
         {:ok, _membership} = Threads.create_membership(thread, user, :owner),
         {:ok, _event} = Threads.create_user_created_thread_event(thread, user),
         {:ok, _sarah_membership} = add_sarah_to_thread(thread) do
      {:ok, user}
    end
  end

  @doc """
  Add Sarah agent to a thread by creating a membership.
  Assumes Sarah agent user already exists (created in seeds).
  """
  def add_sarah_to_thread(%Threads.Thread{} = thread) do
    with %User{type: :agent} = sarah <- get_agent_by_name("sarah") do
      Threads.create_membership(thread, sarah, :producer)
    end
  end

  def init_sarah_membership(thread_id) do
    with %User{type: :agent, id: user_id} <- get_agent_by_name("sarah") do
      Threads.init_membership(%{
        thread_id: thread_id,
        user_id: user_id,
        role: :producer
      })
    end
  end
end
