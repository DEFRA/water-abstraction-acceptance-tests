require_relative "sections/govuk_banner.rb"
require_relative "sections/nav_bar.rb"

class RegisterAddLicencesPage < SitePrism::Page

  section(:govuk_banner, GovukBanner, GovukBanner::SELECTOR)
  section(:nav_bar, NavBar, NavBar::SELECTOR)

  element(:heading, "h1.govuk-heading-l")
  element(:error_heading, "#error-summary-heading-example-2")
  element(:licence_box, "#licence_no")
  element(:continue_button, "button.govuk-button")
  element(:help_link, ".govuk-details__summary-text")
  element(:help_text, ".govuk-details__text")
  element(:sign_out_link, "#signout")

  def submit(args = {})
    licence_box.set(args[:licence_box]) if args.key?(:licence_box)
    continue_button.click
  end

end
