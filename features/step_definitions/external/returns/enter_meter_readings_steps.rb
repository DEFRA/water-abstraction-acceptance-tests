Then("the Enter meter readings page asks for a start reading") do
  page = Pages::External::Returns::EnterMeterReadings.new
  error_message = "Enter a meter start reading"
  expect(page.error_summary.heading).to have_text("There is a problem")
  expect(page.error_summary.links.first).to have_text(error_message)
  expect(page.start_reading_error).to have_text(error_message)
end

Then("the Enter meter readings page asks for valid readings") do
  page = Pages::External::Returns::EnterMeterReadings.new
  error_message = "Reading should be higher than or equal to the start reading"

  expect(page.error_summary.heading).to have_text("There is a problem")
  expect(page.error_summary.links.first).to have_text(error_message)
  expect(page.error_messages).to satisfy do |messages|
    messages.any? do |message|
      message.text.include? error_message
    end
  end
end
