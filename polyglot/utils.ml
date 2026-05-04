(* OCaml utility — list helpers *)
let rec take n = function
  | [] -> []
  | x :: xs -> if n <= 0 then [] else x :: take (n - 1) xs

let rec drop n = function
  | [] -> []
  | _ :: xs as l -> if n <= 0 then l else drop (n - 1) xs

let zip a b = List.map2 (fun x y -> (x, y)) a b
