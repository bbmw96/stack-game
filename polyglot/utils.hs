-- Haskell utility — list helpers
module Utils where

chunks :: Int -> [a] -> [[a]]
chunks _ [] = []
chunks n xs = take n xs : chunks n (drop n xs)

palindrome :: Eq a => [a] -> Bool
palindrome xs = xs == reverse xs
