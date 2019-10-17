Then("the Meter details page asks for the meter serial number") do
  page = Pages::External::Returns::MeterDetails.new
  error_text = "Enter a serial number"

  expect(page.error_summary.heading).to have_text("There is a problem")
  expect(page.error_summary.links).to satisfy do |messages|
    messages.any? do |message|
      message.text.include? error_text
    end
  end
  expect(page.serial_number_error).to have_text(error_text)
end

Then("the Meter details page asks for the meter manufacturer") do
  page = Pages::External::Returns::MeterDetails.new
  error_text = "Enter the make of your meter"

  expect(page.error_summary.heading).to have_text("There is a problem")
  expect(page.error_summary.links).to satisfy do |messages|
    messages.any? do |message|
      message.text.include? error_text
    end
  end
  expect(page.manufacturer_error).to have_text(error_text)
end
