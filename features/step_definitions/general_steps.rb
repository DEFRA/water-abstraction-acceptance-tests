Given(/^I go to the abstraction licences page$/) do
  # Works from any page
  find("#navbar-view a").click
end

When(/^I select a particular licence$/) do
  # Stores licence number for later checks
  @licence_number = Quke::Quke.config.custom["data"]["licence_reg_one"].to_s
  @front_app.licences_page.search(search_input: @licence_number)
  find_link(@licence_number).click
end

When(/^I access the first licence$/) do
  @front_app.licences_page.search(search_input: "/")
  @front_app.licences_page.first_licence.click
end

Then(/^I am on the internal abstraction licences page$/) do
  expect(@front_app.licences_page.internal_heading).to have_text("Licences, users and returns")
  @front_app.licences_page.search(search_input: "/")
  @total_licences = @front_app.licences_page.licence_links.count.to_s
end

Then(/^I am on the licence details page$/) do
  expect(@front_app.licence_details_page.heading).to have_text("Licence number")
  expect(@front_app.licence_details_page.content).to have_text("Source of supply")
  # rubocop:disable Metrics/LineLength
  expect(@front_app.licence_details_page.disclaimer).to have_text("The information included in this service does not replace or affect the legal (paper) copy of the licence issued to you. The information must be used for reference only. You must refer to and comply with the licence issued to you as a paper copy when you make decisions about abstracting or impounding water.")
  # rubocop:enable Metrics/LineLength
end

Then(/^I am on the external abstraction licences page$/) do
  expect(@front_app.licences_page.external_heading).to have_text("Your licences")
end

When(/^I check the licence contact details$/) do
  @front_app.licence_details_page.contact_details.click
end

Then(/^I am on the contact details page$/) do
  expect(@front_app.licences_page.current_url).to include "/contact"
  expect(@front_app.licence_contact_page.heading).to have_text("ontact details")
  @front_app.licence_contact_page.back_link.click
end

When(/^I check the licence points$/) do
  # scroll_to(@front_app.licence_details_page.points_link) # Remove for iOS
  @front_app.licence_details_page.points_link.click
end

Then(/^I am on the licence points page$/) do
  expect(@front_app.licence_points_page.current_url).to include "/points"
  expect(@front_app.licence_points_page.heading).to have_text("Abstraction points for")
  @front_app.licence_points_page.back_link.click
end

When(/^I check the licence purposes$/) do
  find_link("View details of your purpose").click
end

Then(/^I am on the licence purposes page$/) do
  expect(@front_app.licence_purposes_page.current_url).to include "/purposes"
  expect(@front_app.licence_purposes_page.heading).to have_text("Abstraction details for")
  @front_app.licence_purposes_page.back_link.click
end

When(/^I check the licence conditions$/) do
  # scroll_to(@front_app.licence_details_page.conditions_link) # Remove for iOS
  @front_app.licence_details_page.conditions_link.click
end

Then(/^I am on the licence conditions page$/) do
  expect(@front_app.licence_conditions_page.current_url).to include "/conditions"
  expect(@front_app.licence_conditions_page.heading).to have_text("Conditions held for")
  expect(@front_app.licence_conditions_page.disclaimer).to have_text("You must refer to the paper copy of your licence")
  @front_app.licence_conditions_page.back_link.click
end

Given(/^I select the link to name the licence$/) do
  expect(production?).to be false
  @front_app.licence_details_page.click_name_or_rename
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
  @front_app.licences_page.nav_bar.view_licences_link.click
  @front_app.licences_page.search(search_input: @licence_number)
  find_link(@licence_number).click
  expect(@front_app.licences_page).to have_text(@expected_licence_name.to_s)
end

Given(/^the licence name is searchable on the abstraction licences page$/) do
  @front_app.licences_page.nav_bar.view_licences_link.click
  @expected_search_result = @expected_licence_name
  @expected_result_count = 1
  @front_app.licences_page.search(
    search_input: @expected_search_result.to_s
  )
end

Given(/^I select the Cancel link$/) do
  @expected_licence_name = "Generic auto licence name"
  @front_app.licence_details_page.cancel_link.click
end

Given(/^I see an error message telling me the name is invalid$/) do
  @rename_error = @front_app.licence_details_page.licence_rename_error
  expect(@rename_error).to have_text("Check your licence name")
end

Given(/^I reset the licence name$/) do
  @expected_licence_name = "Generic auto licence name"
  @front_app.licence_details_page.submit(licence_name_form: @expected_licence_name)
end

Given(/^I access the back end as "([^"]*)"$/) do |account|
  expect(production?).to be false
  @environment = Quke::Quke.config.custom["environment"].to_s

  @back_app = BackOfficeApp.new
  # Create the back office URL by combining the username, password and root URL.
  @back_root = Quke::Quke.config.custom["urls"][@environment]["back_office_root"].to_s
  # rubocop:disable Metrics/LineLength
  @back_credentials = (Quke::Quke.config.custom["data"]["accounts"][account.to_s] + ":" + Quke::Quke.config.custom["data"]["accounts"]["password"] + "@").to_s
  # rubocop:enable Metrics/LineLength
  # This is the full URL to visit, containing the credentials.
  # Insert username and password from 8th character:
  @back_login = @back_root.insert(8, @back_credentials)
  visit(@back_login)
end

Given(/^I can see the back end page$/) do
  expect(@back_app.back_office_start_page.heading).to have_text("Permit Repository Admin")
end

Given(/^I cannot see the back end page$/) do
  expect(@back_app.back_office_start_page.heading).to not_have_text("Permit Repository Admin")
end
