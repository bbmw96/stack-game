# CoffeeScript utility — async helpers
sleep = (ms) -> new Promise (resolve) -> setTimeout resolve, ms

retry = (fn, attempts = 3) ->
  try
    await fn()
  catch e
    throw e if attempts <= 1
    await sleep 200
    await retry fn, attempts - 1
