require_relative "sections/govuk_banner.rb"

class NotifyMenuPage < SitePrism::Page

  section(:govuk_banner, GovukBanner, "#global-header")
  element(:heading, ".heading-large")

end
