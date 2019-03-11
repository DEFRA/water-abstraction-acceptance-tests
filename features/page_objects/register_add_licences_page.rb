require_relative "sections/govuk_banner.rb"
require_relative "sections/nav_bar.rb"

class RegisterAddLicencesPage < SitePrism::Page

  section(:govuk_banner, GovukBanner, GovukBanner::SELECTOR)
  section(:nav_bar, NavBar, NavBar::SELECTOR)

  element(:heading, ".heading-large")
  element(:error_heading, "#error-summary-heading-example-2")
  element(:licence_box, "#licence_no")
  element(:continue_button, ".button")
  element(:help_link, ".summary")
  element(:help_text, ".closeOnOpen")
  element(:sign_out_link, "#signout a")

  def submit(args = {})
    licence_box.set(args[:licence_box]) if args.key?(:licence_box)
    continue_button.click
  end

end
