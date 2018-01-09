When(/^I select "([^"]*)"$/) do |lic_no|
  @front_app.licences_page.submit(licence: lic_no)
  # Stores licence number for later checks
  @licence_number = lic_no
end

Then(/^I am on the abstraction licences page$/) do
  expect(@front_app.licences_page).to have_text("Your water abstraction licences")
end

When(/^I check the licence contact details$/) do
  @front_app.licence_details_page.contact_details.click
end

Then(/^I am on the contact details page$/) do
  expect(@front_app.licences_page.current_url).to include "/contact"
end

When(/^I check the licence terms$/) do
  scroll_to(@front_app.licence_details_page.licence_terms)
  @front_app.licence_details_page.licence_terms.click
end

Then(/^I am on the licence terms page$/) do
  expect(@front_app.licences_page.current_url).to include "/terms"
end

When(/^I individually select each licence$/) do
  scroll_to(@front_app.licence_terms_page.source)
  @front_app.licence_terms_page.source.click
  @front_app.licence_terms_page.point.click
  @front_app.licence_terms_page.purpose.click
  scroll_to(@front_app.licence_terms_page.means_of_abstraction)
  @front_app.licence_terms_page.means_of_abstraction.click
  @front_app.licence_terms_page.means_of_measurement.click
  @front_app.licence_terms_page.max_quantities.click
end

Then(/^I can see all my licence term details$/) do
  expect(@front_app.licence_terms_page).to have_text("Close all")
end
