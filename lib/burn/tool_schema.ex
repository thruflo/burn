defmodule Burn.ToolSchema do
  @moduledoc """
  Use Ecto schemas to describe LLM tools.

  ## Example

    defmodule MyApp.Tools.Calculator do
      use Burn.ToolSchema

      @name "calculator"
      @description "Performs basic math operations"

      @primary_key false
      embedded_schema do
        field(:operation, :string)
        field(:x, :float)
        field(:y, :float)
      end
    end

  The name and description are important -- they're passed to the LLM to use
  when deciding what tool to use.

  Define a `c:json_schema/0` callback to pre-cache and optimise the schema,
  including field descriptions and hints.
  """

  @doc """
  Tool name.
  """
  @callback name() :: String.t()

  @doc """
  Tool description.
  """
  @callback description() :: String.t()

  @doc """
  Defines JSON schema for the instruction.

  By default, `InstructorLite.JSONSchema.from_ecto_schema/1` is called at runtime
  every time InstructorLite needs to convert an Ecto schema to JSON schema.

  However, you can bake your own JSON schema into the `c:json_schema/0` callback
  to eliminate the need to do it on every call.

  > #### Tip {: .tip}
  >
  > Take advantage of this callback! Most JSON schemas are known ahead of time,
  > so there is no need to constantly build them at runtime. In addition, the
  > `InstructorLite.JSONSchema` module aims to generate one-size-fits-all schema,
  > so it's very unlikely to take full advantage of the capabilities of your LLM.
  """
  @callback json_schema() :: map()

  @doc """
  Represent as a map for use in the tools array sent in the params to the LLM.
  """
  @callback tool_param() :: map()

  @doc """
  Called by `InstructorLite.consume_response/3` when validating the LLM response.
  """
  @callback validate_changeset(Ecto.Changeset.t(), InstructorLite.opts()) :: Ecto.Changeset.t()

  @optional_callbacks validate_changeset: 2

  defmacro __before_compile__(%Macro.Env{module: module} = env) do
    name_func =
      unless Module.defines?(module, {:name, 0}) do
        case Module.has_attribute?(module, :name) do
          true ->
            quote do
              @impl Burn.ToolSchema
              def name(), do: @name
            end

          false ->
            raise CompileError,
              description: """
                Module `#{module}` must define a `@name` module attribute or
                a `c:name/0` callback when using `Burn.ToolSchema`.
              """,
              file: env.file,
              line: env.line
        end
      end

    description_func =
      unless Module.defines?(module, {:description, 0}) do
        case Module.has_attribute?(module, :description) do
          true ->
            quote do
              @impl Burn.ToolSchema
              def description(), do: @description
            end

          false ->
            raise CompileError,
              description: """
                Module `#{module}` must define a `@description` module attribute or
                a `c:description/0` callback when using `Burn.ToolSchema`.
              """,
              file: env.file,
              line: env.line
        end
      end

    [name_func, description_func]
  end

  defmacro __using__(_opts) do
    quote do
      use Ecto.Schema
      import Ecto.Changeset

      @behaviour Burn.ToolSchema
      @before_compile Burn.ToolSchema

      @impl Burn.ToolSchema
      def json_schema do
        InstructorLite.JSONSchema.from_ecto_schema(__MODULE__)
      end

      @impl Burn.ToolSchema
      def tool_param do
        %{
          name: __MODULE__.name(),
          description: __MODULE__.description(),
          input_schema: json_schema()
        }
      end

      defoverridable json_schema: 0, tool_param: 0
    end
  end
end
