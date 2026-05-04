{ Pascal utility — string helpers }
unit Utils;

interface
  function Slugify(const S: string): string;

implementation

function Slugify(const S: string): string;
var
  i: Integer;
  c: Char;
begin
  Result := '';
  for i := 1 to Length(S) do
  begin
    c := LowerCase(S[i])[1];
    if c in ['a'..'z', '0'..'9'] then Result := Result + c
    else if (Result <> '') and (Result[Length(Result)] <> '-') then
      Result := Result + '-';
  end;
end;

end.
