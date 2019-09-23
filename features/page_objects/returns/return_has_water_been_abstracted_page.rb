class ReturnHasWaterBeenAbstractedPage < SitePrism::Page

  element(:heading, "h1.govuk-heading-l")
  element(:question, "form .govuk-fieldset__legend.govuk-fieldset__legend--m")

  element(:continue_button, "button[type=submit]")

  element(:yes, "#isNil-1", visible: false)
  element(:no, "#isNil-2", visible: false)

end
