# R utility - statistical helpers
normalize <- function(x) {
  (x - min(x)) / (max(x) - min(x))
}

zscore <- function(x) {
  (x - mean(x)) / sd(x)
}

moving_avg <- function(x, n = 3) {
  stats::filter(x, rep(1/n, n), sides = 2)
}
