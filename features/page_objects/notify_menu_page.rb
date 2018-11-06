require_relative "sections/govuk_banner.rb"

class NotifyMenuPage < SitePrism::Page

  section(:govuk_banner, GovukBanner, GovukBanner::SELECTOR)
  element(:heading, ".heading-large")

end
