class RegisterConfirmLicencesPage < SitePrism::Page

  element(:heading, "h1.govuk-heading-l")
  element(:error_heading, "#error-summary-heading-example-2")
  element(:licence_checkbox, ".govuk-checkboxes input[name=licences]")
  element(:continue_button, "form button.govuk-button")
  element(:not_mine_link, ".govuk-grid-column-two-thirds a.govuk-link")

end
