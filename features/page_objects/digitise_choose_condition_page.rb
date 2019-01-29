require_relative "sections/govuk_banner.rb"

class DigitiseChooseConditionPage < SitePrism::Page

  section(:govuk_banner, GovukBanner, GovukBanner::SELECTOR)

  element(:heading, ".govuk-heading-l")
  element(:condition_2_3_radio, "#wr22_/wr22/2.3", visible: false)
  elements(:input_box, ".form-control")
  element(:submit_button, ".button")
  element(:continue_button, ".govuk-button")

end
