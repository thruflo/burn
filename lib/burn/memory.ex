defmodule Burn.Memory do
  @moduledoc """
  The Memory context.
  """

  alias Ecto.Changeset
  import Ecto.Query, warn: false

  alias Burn.{
    Accounts,
    Repo,
    Threads
  }

  alias Burn.Memory.Fact

  @doc """
  Returns the list of facts.

  ## Examples

      iex> list_facts()
      [%Fact{}, ...]

  """
  def list_facts do
    Repo.all(Fact)
  end

  @doc """
  Gets a single fact.

  Raises `Ecto.NoResultsError` if the Fact does not exist.

  ## Examples

      iex> get_fact!(123)
      %Fact{}

      iex> get_fact!(456)
      ** (Ecto.NoResultsError)

  """
  def get_fact!(id), do: Repo.get!(Fact, id)

  @doc """
  Creates a fact.

  ## Examples

      iex> create_fact(%{field: value})
      {:ok, %Fact{}}

      iex> create_fact(%{field: bad_value})
      {:error, %Changeset{}}

  """
  def create_fact(
        %Threads.Thread{id: thread_id},
        %Threads.Event{id: source_event_id},
        %Accounts.User{id: subject_id},
        attrs \\ %{}
      ) do
    assoc_attrs = %{
      thread_id: thread_id,
      source_event_id: source_event_id,
      subject_id: subject_id
    }
    assoc_fields = Map.keys(assoc_attrs)

    %Fact{}
    |> Changeset.cast(assoc_attrs, assoc_fields)
    |> Fact.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a fact.

  ## Examples

      iex> update_fact(fact, %{field: new_value})
      {:ok, %Fact{}}

      iex> update_fact(fact, %{field: bad_value})
      {:error, %Changeset{}}

  """
  def update_fact(%Fact{} = fact, attrs) do
    fact
    |> Fact.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a fact.

  ## Examples

      iex> delete_fact(fact)
      {:ok, %Fact{}}

      iex> delete_fact(fact)
      {:error, %Changeset{}}

  """
  def delete_fact(%Fact{} = fact) do
    Repo.delete(fact)
  end

  @doc """
  Returns an `%Changeset{}` for tracking fact changes.

  ## Examples

      iex> change_fact(fact)
      %Changeset{data: %Fact{}}

  """
  def change_fact(%Fact{} = fact, attrs \\ %{}) do
    Fact.changeset(fact, attrs)
  end
end
