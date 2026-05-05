# Erlang-style Elixir - process helpers
defmodule ProcUtils do
  def retry(fun, attempts \\ 3) do
    try do
      fun.()
    rescue
      _ when attempts > 1 -> retry(fun, attempts - 1)
      e -> reraise e, __STACKTRACE__
    end
  end
end
