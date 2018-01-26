When(/^I select "([^"]*)"$/) do |lic_no|
  @front_app.licences_page.submit(licence: lic_no)
  # Stores licence number for later checks
  @licence_number = lic_no
end

Then(/^I am on the abstraction licences page$/) do
  expect(@front_app.licences_page).to have_text("Your water abstraction licences")
  @total_licences = @front_app.licences_page.view_links.count.to_s
  puts "Licences count is: " + @total_licences
  # Shows total number of licences available to that user.
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

When(/^I individually select each heading$/) do
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

Given(/^I select the "Name this licence" link$/) do
  @front_app.licence_details_page.rename_link.click
end

Given(/^I enter a valid licence name$/) do
  @expected_licence_name = "'Renameobot'"
  @front_app.licence_details_page.submit(licence_name_form: @expected_licence_name)
end

Given(/^I enter a licence name which is invalid$/) do
  @expected_licence_name = "Generic auto licence name"
  @front_app.licence_details_page.submit(licence_name_form: "!@£$%^&*()")
end

Given(/^the expected licence name appears on the licence summary page$/) do
  @front_app.licence_details_page.abstraction_licences_link.click
  expect(@front_app.licences_page).to have_text(@expected_licence_name.to_s)
end

Given(/^the licence name is searchable on the abstraction licences page$/) do
  @front_app.licence_details_page.abstraction_licences_link.click
  @expected_search_result = @expected_licence_name
  @expected_result_count = 1
  @front_app.licences_page.search(
    search_form: @expected_search_result.to_s
  )
end

Given(/^I select the Cancel link$/) do
  @expected_licence_name = "Generic auto licence name"
  @front_app.licence_details_page.cancel_link.click
end

Given(/^I see an error message telling me the name is invalid$/) do
  @rename_error = @front_app.licence_details_page.licence_rename_error
  expect(@rename_error).to have_text("There was a problem with the licence name field")
end

Given(/^I reset the licence name$/) do
  @expected_licence_name = "Generic auto licence name"
  @front_app.licence_details_page.submit(licence_name_form: @expected_licence_name)
end
