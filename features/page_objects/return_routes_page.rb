class ReturnRoutesPage < SitePrism::Page

  element(:heading, ".heading-large")
  element(:content, "#content")
  element(:question, "#action .heading-medium")
  element(:question2, ".heading-medium")
  element(:question1, ".govuk-heading-m")
  element(:question3, ".govuk-fieldset__legend")
  element(:day, "#receivedDate-day")
  element(:month, "#receivedDate-month")
  element(:year, "#receivedDate-year")
  element(:yesterday, "#btnreceivedDateYesterday")

  # Radio buttons - use unique html attributes.
  element(:first_action_radio, "input[id='radio-inline-0']", visible: false)
  element(:second_action_radio, "input[id='radio-inline-1']", visible: false)
  # These use the same identifiers but different options.
  element(:enter_radio, "input[id='radio-inline-0']", visible: false)
  element(:query_radio, "input[id='radio-inline-1']", visible: false)
  # Do you have volumes to report? / Is it a single amount? / One or more meters?
  element(:yes_radio, ".govuk-radios__item:nth-child(1) .govuk-radios__label", visible: false)
  element(:no_radio, ".govuk-radios__item:nth-child(2) .govuk-radios__label", visible: false)
  element(:no_radio1, "input[id='isNil-2']", visible: false)
  element(:yes_radio1, "#radio-inline-0", visible: false)
  element(:no_radio2, "#radio-inline-1", visible: false)
  # How are you reporting your return?
  element(:method_meter_radio, "input[id='radio-inline-0']", visible: false)
  element(:method_volume_radio, "input[id='radio-inline-1']", visible: false)
  # What is the unit of measurement?
  element(:unit_m3_radio, ".govuk-radios__item:nth-child(1) .govuk-radios__label", visible: false)
  element(:unit_l_radio, ".govuk-radios__item:nth-child(2) .govuk-radios__label", visible: false)
  element(:unit_Ml_radio, ".govuk-radios__item:nth-child(3) .govuk-radios__label", visible: false)
  element(:unit_gal_radio, ".govuk-radios__item:nth-child(4) .govuk-radios__label", visible: false)

  element(:meter_manufacturer_form, "#manufacturer")
  element(:meter_serialnumber_form, "#serialNumber")
  element(:meter_start_reading_form, "#startReading")
  element(:meter_x10_checkbox, "input[name='isMultiplier']", visible: false)

  element(:nil_return_heading, "h2", match: :first )
  element(:continue_button, "button")
  element(:continue_button1, "button", text: "Continue")

  def submit(args = {})
    meter_manufacturer_form.set(args[:manufacturer]) if args.key?(:manufacturer)
    meter_serialnumber_form.set(args[:serial]) if args.key?(:serial)
    meter_start_reading_form.set(args[:start_reading]) if args.key?(:start_reading)
    continue_button.click
  end

end
