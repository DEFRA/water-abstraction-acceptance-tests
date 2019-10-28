class ReturnUnitsPage < SitePrism::Page

  element(:heading, "h1.govuk-heading-l")
  element(:question, "form .govuk-fieldset__legend.govuk-fieldset__legend--m")

  element(:continue_button, "form button.govuk-button")

  element(:cubic_meters, "#units", visible: false)
end
