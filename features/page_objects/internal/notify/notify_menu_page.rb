require_relative "../../../page_objects/sections/govuk_banner"

class NotifyMenuPage < SitePrism::Page

  section(:govuk_banner, GovukBanner, GovukBanner::SELECTOR)
  element(:heading, ".govuk-heading-l")

end
