-- Ada utility — safe division
package body Utils is
   function Safe_Divide (A, B : Float) return Float is
   begin
      if B = 0.0 then
         return 0.0;
      end if;
      return A / B;
   end Safe_Divide;
end Utils;
