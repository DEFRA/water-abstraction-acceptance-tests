Then("the Have you abstracted water page displays the validation errors") do
  page = Pages::External::Returns::HasWaterBeenAbstracted.new

  expect(page.error_summary.heading).to have_text("There is a problem")
  expect(page.error_summary.links.first).to have_text("Has any water been abstracted?")
end

And("I submit no answer on the Have you abstracted water page") do
  page = Pages::External::Returns::HasWaterBeenAbstracted.new
  page.continue_button.click
end
