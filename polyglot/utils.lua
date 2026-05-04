-- Lua utility — table helpers
local M = {}

function M.keys(t)
  local ks = {}
  for k in pairs(t) do ks[#ks+1] = k end
  return ks
end

function M.map(t, fn)
  local out = {}
  for i, v in ipairs(t) do out[i] = fn(v) end
  return out
end

return M
