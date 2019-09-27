Then("the How are you reporting your figures page displays validation errors") do
  page = Pages::External::Returns::HowAreYouReportingFigures.new
  error_text = "Select readings from one meter, or other (abstraction volumes)"

  expect(page.error_summary.heading).to have_text("There is a problem")
  expect(page.error_summary.links.first).to have_text(error_text)
  expect(page.method_error).to have_text(error_text)
end
