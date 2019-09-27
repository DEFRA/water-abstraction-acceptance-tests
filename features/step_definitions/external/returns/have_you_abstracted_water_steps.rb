
Then("the Have you abstracted water page displays the expected details") do
  page = Pages::External::Returns::HasWaterBeenAbstracted.new

  expect(page).to be_displayed

  data = @test_data.current_licence_with_return
  metadata = data["return"]["metadata"]
  description = metadata["description"]
  purpose = metadata["purposes"][0]["alias"]
  licence_number = data["return"]["licence_ref"]

  expect(page.site_description_text).to eq(description)
  expect(page.purpose_text).to eq(purpose)
  expect(page.return_period_text).to match(/^\d{1,2} \w{3,9} \d{4} to \d{1,2} \w{3,9} \d{4}$/)
  expect(page.abstraction_period_text).to match(/^\d{1,2} \w{3,9} to \d{1,2} \w{3,9}$/)
  expect(page.heading).to have_text("Abstraction return")
  expect(page.licence_number).to have_text("Licence number #{licence_number}")
  expect(page.question).to have_text("Have you abstracted water in this return period?")
end

Then("the Have you abstracted water page displays the validation errors") do
  page = Pages::External::Returns::HasWaterBeenAbstracted.new

  expect(page.error_summary.heading).to have_text("There is a problem")
  expect(page.error_summary.links.first).to have_text("Has any water been abstracted?")
end

And("I submit no answer on the Have you abstracted water page") do
  page = Pages::External::Returns::HasWaterBeenAbstracted.new
  page.continue_button.click
end
