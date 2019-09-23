class ReturnRoutesPage < SitePrism::Page

  element(:heading, "h1.govuk-heading-l")

  element(:question, "form .govuk-fieldset__legend.govuk-fieldset__legend--m")
  element(:question1, ".govuk-heading-m")
  element(:question2, ".heading-medium")
  element(:question3, ".govuk-fieldset__legend")

  # These use the same identifiers but different options.
  element(:enter_radio, ".govuk-radios__item:nth-child(1) .govuk-radios__input", visible: false)

  # Do you have volumes to report? / Is it a single amount? / One or more meters?
  element(:yes_radio1, "#radio-inline-0", visible: false)
  element(:no_radio2, "#radio-inline-1", visible: false)
  # How are you reporting your return?
  element(:method_meter_radio, "input[id='radio-inline-0']", visible: false)
  element(:method_volume_radio, "input[id='radio-inline-1']", visible: false)
  # What is the unit of measurement?
  element(:unit_gal_radio, ".govuk-radios__item:nth-child(4) .govuk-radios__label", visible: false)

  element(:nil_return_heading, "h2", match: :first)
  element(:continue_button, "button")

  def submit(args = {})
    meter_manufacturer_form.set(args[:manufacturer]) if args.key?(:manufacturer)
    meter_serialnumber_form.set(args[:serial]) if args.key?(:serial)
    meter_start_reading_form.set(args[:start_reading]) if args.key?(:start_reading)
    continue_button.click
  end

end
