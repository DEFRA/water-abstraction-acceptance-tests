class NotifyConfirmLicencesPage < SitePrism::Page

  element(:heading, ".govuk-heading-l")
  element(:error_heading, "#error-summary-heading-example")
  element(:licence_checkbox, "#checkbox-0")
  elements(:licence_checkboxes, ".govuk-table__cell:nth-child(1)")
  element(:continue_button, ".govuk-button")

end
