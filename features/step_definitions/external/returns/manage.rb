Then("I navigate to the manage returns page") do
  page = Pages::External::Returns::Manage.new
  page.load
end

Then("I cannot see the bulk returns upload link") do
  page = Pages::External::Returns::Manage.new
  expect(page).to be_displayed
  expect(page).not_to have_bulk_upload_link
end
