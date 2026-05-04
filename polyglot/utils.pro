% Prolog utility — list predicates
:- module(utils, [my_length/2, my_last/2, my_nth/3]).

my_length([], 0).
my_length([_|T], N) :- my_length(T, N1), N is N1 + 1.

my_last([X], X).
my_last([_|T], X) :- my_last(T, X).

my_nth(1, [H|_], H).
my_nth(N, [_|T], X) :- N > 1, N1 is N - 1, my_nth(N1, T, X).
