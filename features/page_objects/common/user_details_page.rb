require_relative "../../page_objects/sections/nav_bar"

class UserDetailsPage < SitePrism::Page
  section(:nav_bar, NavBar, NavBar::SELECTOR)

  element(:caption, ".govuk-caption-l")
  element(:heading, ".break-word")
  element(:content, ".heading-small")
  elements(:verification_codes, "p.govuk-body span.govuk-body")

  def latest_verification_code
    verification_codes.first.text
  end
end
