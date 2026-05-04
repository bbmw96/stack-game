// F# utility — option helpers
module Utils

let orDefault defaultVal = function
    | Some v -> v
    | None   -> defaultVal

let tryFind pred lst =
    lst |> List.tryFind pred

let pipeline fns initial =
    List.fold (fun acc f -> f acc) initial fns
