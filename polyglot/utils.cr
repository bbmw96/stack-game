# Crystal utility — time helpers
module Utils
  def self.age_years(dob : Time) : Int32
    now = Time.utc
    years = now.year - dob.year
    years -= 1 if now.month < dob.month ||
                  (now.month == dob.month && now.day < dob.day)
    years
  end
end
