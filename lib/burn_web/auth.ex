defmodule BurnWeb.Auth do
  use BurnWeb, :verified_routes

  import Plug.Conn
  alias Burn.Accounts

  def fetch_api_user(conn, _opts) do
    with ["Bearer " <> user_id] <- get_req_header(conn, "authorization"),
         %Accounts.User{} = user <- Accounts.get_user(user_id) do
      assign(conn, :current_user, user)
    else
      _ ->
        assign(conn, :current_user, nil)
    end
  end

  def require_authenticated_user(conn, _opts) do
    if conn.assigns[:current_user] do
      conn
    else
      conn
      |> put_status(401)
      |> send_resp(:unauthorized, "")
      |> halt()
    end
  end
end
