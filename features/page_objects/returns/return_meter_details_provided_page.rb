class ReturnMeterDetailsProvidedPage < SitePrism::Page

  element(:heading, "h1.govuk-heading-l")
  element(:question, "form .govuk-fieldset__legend.govuk-fieldset__legend--m")

  element(:continue_button, "button[type=submit]")

  element(:yes, "#meterDetailsProvided-1", visible: false)
  element(:no, "#meterDetailsProvided-2", visible: false)
end
