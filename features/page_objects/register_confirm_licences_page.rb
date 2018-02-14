class RegisterConfirmLicencesPage < SitePrism::Page

  element(:heading, ".heading-large")
  element(:error_heading, "#error-summary-heading-example-2")
  element(:licence_checkbox, "#licences input")
  element(:continue_button, ".button")
  element(:not_mine_link, ".column-two-thirds p a")

  def submit(_args = {})
    continue_button.click
  end

end
