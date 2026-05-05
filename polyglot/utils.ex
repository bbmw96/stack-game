# Elixir utility - map helpers
defmodule Utils do
  def deep_merge(left, right) when is_map(left) and is_map(right) do
    Map.merge(left, right, fn _k, l, r -> deep_merge(l, r) end)
  end
  def deep_merge(_left, right), do: right

  def flatten_keys(map, prefix \\ "") do
    Enum.flat_map(map, fn {k, v} ->
      full = if prefix == "", do: "#{k}", else: "#{prefix}.#{k}"
      if is_map(v), do: flatten_keys(v, full), else: [{full, v}]
    end)
    |> Map.new()
  end
end
