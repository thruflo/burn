# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     Burn.Repo.insert!(%Burn.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

alias Burn.{Accounts, Repo}

# Create Sarah agent user
case Accounts.get_agent_by_name("sarah") do
  nil ->
    attrs = %{
      type: :agent,
      name: "sarah",
      avatar_url: "/images/agents/sarah.jpg"
    }

    %Accounts.User{}
    |> Accounts.User.changeset(attrs)
    |> Repo.insert!()
    |> IO.inspect(label: "Created Sarah agent")

  sarah ->
    IO.inspect(sarah, label: "Sarah agent already exists")
end
