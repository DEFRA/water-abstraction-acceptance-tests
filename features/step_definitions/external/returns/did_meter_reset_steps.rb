Then("the Did your meter reset page displays validation errors") do
  page = Pages::External::Returns::DidMeterReset.new

  expect(page.error_summary.heading).to have_text("There is a problem")
  expect(page.error_summary.links.first).to have_text("Has your meter reset or rolled over?")
  expect(page.meter_reset_error).to have_text("Has your meter reset or rolled over?")
end

Then("I am informed that I must provide abstraction volumes") do
  page = Pages::External::Returns::DidMeterReset.new
  expect(page).to have_meter_reset_hint
end
