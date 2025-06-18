
# Burn

The idea here is to create a system where the agent can:

- collect facts about all the users
  - you can ask a user for facts about themselves
  - you can ask other users for facts about them

- until a user says "burn me"
- then burn them!

User
Thread
Event
Fact

Surface all these to the front-end using sync.

Have tools for:
- ask a user for facts about themselves
- ask another user for facts about a user
- closing the thread

Instructions to decide what to do next:
- if a user asks to be burned
  - if you have at least three facts about them
      burn them
  - else
      explain you need to know more about them
      collect more facts about them
- else if a user provides facts about themselves
  - extract out the facts
- else if a user provides facts about another user
  - ask the user if they're true
- if a user confirms / denies or revises facts about themselves provided by another user
  - extract out the facts
- else
    either ask a user for facts about themselves
    or ask a user for facts about another user

sys prompt:
- keep all your messages very short
- collect facts about all the users
  - you can ask a user for facts about themselves
  - you can ask other users for facts about them
- until a user says "burn me" or "burn <user>"
- then burn them!


Assets were setup with

XXX
https://mazaheri.dev/posts/vite-in-phoenix-2/

## Run

To start your Phoenix server:

  * Run `mix setup` to install and setup dependencies
  * Start Phoenix endpoint with `mix phx.server` or inside IEx with `iex -S mix phx.server`

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

Ready to run in production? Please [check our deployment guides](https://hexdocs.pm/phoenix/deployment.html).

## Learn more

  * Official website: https://www.phoenixframework.org/
  * Guides: https://hexdocs.pm/phoenix/overview.html
  * Docs: https://hexdocs.pm/phoenix
  * Forum: https://elixirforum.com/c/phoenix-forum
  * Source: https://github.com/phoenixframework/phoenix
