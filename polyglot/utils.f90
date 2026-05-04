! Fortran utility — statistical helpers
module utils
  implicit none
contains
  pure function mean(arr) result(m)
    real, intent(in) :: arr(:)
    real :: m
    m = sum(arr) / real(size(arr))
  end function mean

  pure function variance(arr) result(v)
    real, intent(in) :: arr(:)
    real :: v
    v = sum((arr - mean(arr))**2) / real(size(arr))
  end function variance
end module utils
