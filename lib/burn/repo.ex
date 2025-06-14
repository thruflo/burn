defmodule Burn.Repo do
  use Ecto.Repo,
    otp_app: :burn,
    adapter: Ecto.Adapters.Postgres
end
