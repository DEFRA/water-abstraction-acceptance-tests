class ReturnRoutesPage < SitePrism::Page

  element(:heading, ".heading-large")
  element(:content, "#content")
  element(:question, ".heading-medium")

  # Radio buttons - use unique html attributes.
  # These use the same identifiers but different options.
  element(:enter_radio, "input[id='radio-inline-0']", visible: false)
  element(:query_radio, "input[id='radio-inline-1']", visible: false)
  # Do you have volumes to report? / Is it a single amount? / One or more meters?
  element(:yes_radio, "input[id='radio-inline-0']", visible: false)
  element(:no_radio, "input[id='radio-inline-1']", visible: false)
  # How are you reporting your return?
  element(:method_meter_radio, "input[id='radio-inline-0']", visible: false)
  element(:method_volume_radio, "input[id='radio-inline-1']", visible: false)
  # What is the unit of measurement?
  element(:unit_m3_radio, "input[id='radio-inline-0']", visible: false)
  element(:unit_l_radio, "input[id='radio-inline-1']", visible: false)
  element(:unit_Ml_radio, "input[id='radio-inline-2']", visible: false)
  element(:unit_gal_radio, "input[id='radio-inline-3']", visible: false)

  element(:meter_manufacturer_form, "#manufacturer")
  element(:meter_serialnumber_form, "#serialNumber")
  element(:meter_start_reading_form, "#startReading")
  element(:meter_x10_checkbox, "input[name='isMultiplier']", visible: false)

  element(:nil_return_heading, "h3")
  element(:continue_button, "button")

  def submit(args = {})
    meter_manufacturer_form.set(args[:manufacturer]) if args.key?(:manufacturer)
    meter_serialnumber_form.set(args[:serial]) if args.key?(:serial)
    meter_start_reading_form.set(args[:start_reading]) if args.key?(:start_reading)
    continue_button.click
  end

end
