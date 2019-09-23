class ReturnMetersOrReadingsPage < SitePrism::Page

  element(:heading, "h1.govuk-heading-l")
  element(:question, "form .govuk-fieldset__legend.govuk-fieldset__legend--m")

  element(:continue_button, "button[type=submit]")

  element(:meter_readings, "#method-1", visible: false)
  element(:abstraction_volues, "#method-2", visible: false)

end
