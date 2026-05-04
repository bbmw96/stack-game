# Ruby utility — string helpers
module Utils
  def self.camel_to_snake(str)
    str.gsub(/([A-Z]+)([A-Z][a-z])/, '\1_\2')
       .gsub(/([a-z])([A-Z])/, '\1_\2')
       .downcase
  end

  def self.snake_to_camel(str)
    str.split('_').map(&:capitalize).join
  end
end
