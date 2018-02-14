When(/^I select a particular licence$/) do
  @environment = Quke::Quke.config.custom["current_environment"].to_s
  @licence_number = Quke::Quke.config.custom["data"][@environment]["licence_main"].to_s
  @front_app.licences_page.submit(licence: @licence_number)
  # Stores licence number for later checks
end

When(/^I access the first licence$/) do
  @front_app.licences_page.first_licence.click
end

Then(/^I am on the abstraction licences page$/) do
  expect(@front_app.licences_page).to have_text("Your water abstraction licences")
  @total_licences = @front_app.licences_page.view_links.count.to_s
end

When(/^I check the licence contact details$/) do
  @front_app.licence_details_page.contact_details.click
end

Then(/^I am on the contact details page$/) do
  expect(@front_app.licences_page.current_url).to include "/contact"
end

When(/^I check the licence points$/) do
  scroll_to(@front_app.licence_details_page.points_link)
  @front_app.licence_details_page.points_link.click
end

Then(/^I am on the licence points page$/) do
  expect(@front_app.licence_points_page.current_url).to include "/points"
  expect(@front_app.licence_points_page).to have_text("Abstraction points for licence")
end

When(/^I check the licence purposes$/) do
  @front_app.licences_page.click_link(text: "your abstraction purpose")
end

Then(/^I am on the licence purposes page$/) do
  expect(@front_app.licence_purposes_page.current_url).to include "/purposes"
  expect(@front_app.licence_purposes_page).to have_text("Abstraction purposes for licence")
end

When(/^I check the licence conditions$/) do
  scroll_to(@front_app.licence_details_page.conditions_link)
  @front_app.licence_details_page.conditions_link.click
end

Then(/^I am on the licence conditions page$/) do
  expect(@front_app.licence_conditions_page.current_url).to include "/conditions"
  expect(@front_app.licence_conditions_page.heading).to have_text("Conditions held for")
  expect(@front_app.licence_conditions_page.disclaimer).to have_text("You must refer to the paper copy of your licence")
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
  @front_app.licence_details_page.back_link.click
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
