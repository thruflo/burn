defmodule Burn.MixProject do
  use Mix.Project

  def project do
    [
      app: :burn,
      version: "0.1.0",
      elixir: "~> 1.18",
      elixirc_paths: elixirc_paths(Mix.env()),
      start_permanent: Mix.env() == :prod,
      aliases: aliases(),
      deps: deps()
    ]
  end

  # Configuration for the OTP application.
  #
  # Type `mix help compile.app` for more information.
  def application do
    [
      mod: {Burn.Application, []},
      extra_applications: [:logger, :runtime_tools]
    ]
  end

  # Specifies which paths to compile per environment.
  defp elixirc_paths(:test), do: ["lib", "test/support"]
  defp elixirc_paths(_), do: ["lib"]

  # Specifies your project dependencies.
  #
  # Type `mix help deps` for examples and options.
  defp deps do
    [
      {:bandit, "~> 1.5"},
      {:dns_cluster, "~> 0.1.1"},
      {:dotenvy, "~> 1.1.0"},
      {:ecto_sql, "~> 3.10"},
      {:electric_client,
       path: "../../electric-sql/electric/packages/elixir-client", override: true},
      {:electric, "~> 1.0.19", override: true},
      {:finch, "~> 0.13"},
      {:floki, ">= 0.30.0", only: :test},
      {:gettext, "~> 0.26"},
      {:igniter, "~> 0.5", only: :dev},
      {:instructor_lite, "~> 0.3.0"},
      {:jason, "~> 1.2"},
      {:oban, "~> 2.19"},
      {:phoenix, "~> 1.7.21"},
      {:phoenix_ecto, "~> 4.5"},
      {:phoenix_html, "~> 4.1"},
      {:phoenix_live_reload, "~> 1.2", only: :dev},
      {:phoenix_live_view, "~> 1.0"},
      # {:phoenix_sync, "~> 0.4.3"},
      {:phoenix_sync,
       path: "../../electric-sql/phoenix_sync", override: true},
      {:postgrex, ">= 0.0.0"},
      {:req, "~> 0.5.9"},
      {:telemetry_metrics, "~> 1.0"},
      {:telemetry_poller, "~> 1.0"},
      {:yamel, "~> 2.0"}
    ]
  end

  # Aliases are shortcuts or tasks specific to the current project.
  # For example, to install project dependencies and perform other setup tasks, run:
  #
  #     $ mix setup
  #
  # See the documentation for `Mix` for more info on aliases.
  defp aliases do
    [
      setup: ["deps.get", "ecto.setup", "assets.setup", "assets.build"],
      "ecto.setup": ["ecto.create", "ecto.migrate", "run priv/repo/seeds.exs"],
      "ecto.setup.quiet": [
        "ecto.create --quiet",
        "ecto.migrate --quiet",
        "run priv/repo/seeds.exs"
      ],
      "ecto.reset": ["ecto.drop", "ecto.setup"],
      "ecto.reset.quiet": ["ecto.drop --quiet", "ecto.setup.quiet"],
      test: ["ecto.reset.quiet", "test"],
      "assets.setup": ["cmd --cd assets pnpm install"],
      "assets.build": ["cmd --cd assets pnpm vite build --config vite.config.js"],
      "assets.deploy": [
        "cmd --cd assets pnpm vite build --mode production --config vite.config.js",
        "phx.digest"
      ]
    ]
  end
end
