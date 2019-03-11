Given(/^I select a second page of many licences$/) do
  @expected_search_result = "/"
  @expected_result_count = 50
  @front_app.licences_page.search(
    search_input: @expected_search_result.to_s
  )
  @front_app.licences_page.pagetwo.click
end

Given(/^I can see a full page of licences$/) do
  if @user_type == "external_user"
    expect(@front_app.licences_page).to have_licence_links_external count: @expected_result_count.to_i
  else
    puts "Count: " + @front_app.licences_page.licence_links_internal.count.to_s
    expect(@front_app.licences_page).to have_licence_links_internal count: @expected_result_count.to_i
  end
end

Given(/^I can see the correct number of pagination links$/) do
  @environment = Quke::Quke.config.custom["environment"].to_s
  @expected_pages = Quke::Quke.config.custom["data"]["total_pages"][@environment]
  expect(@front_app.licences_page.pagination_text).to have_text(@expected_pages.to_s)
end

Given(/^I search for (?:a|an) "([^"]*)" licence$/) do |licencetype|
  @environment = Quke::Quke.config.custom["environment"].to_s
  @expected_search_result = Quke::Quke.config.custom["data"]["licence_" + licencetype.to_s].to_s
  @front_app.licences_page.search(
    search_input: @expected_search_result.to_s
  )
end

Given(/^I search for a partial licence number$/) do
  @expected_search_result = "29/01/*G"
  @expected_result_count = 5
  @front_app.licences_page.search(
    search_input: @expected_search_result.to_s
  )
end

Given(/^I search for a return$/) do
  # Search for a return ID (usually 8 digits)
  @expected_search_result = "10025511"
  @expected_result_count = 1
  @front_app.licences_page.search(
    search_input: @expected_search_result.to_s
  )
end

Then(/^I can access the return details$/) do
  find_link(@expected_search_result).click
  expect(@front_app.return_details_page.heading).to have_text("Abstraction return for")
  expect(@front_app.return_details_page.return_info).to have_text(@expected_search_result)
  # Additional check that the return ID exists on the returns tab of the licence
  @front_app.return_details_page.view_licence_link.click
  @front_app.licence_details_page.returns_tab.click
  expect(@front_app.licence_details_page.returns_table).to have_text(@expected_search_result)
  @front_app.licence_details_page.nav_bar.view_licences_link.click
end

When(/^I search for an "([^"]*)"$/) do |user_type|
  @expected_search_result = Quke::Quke.config.custom["data"]["accounts"][user_type.to_s]
  @expected_result_count = if user_type == "external_user"
                             1
                           else
                             2 # because the internal user also has an admin account which is shown
                           end
  @expected_user_type = if user_type == "external_user"
                          "External"
                        else
                          "Internal"
                        end
  @front_app.licences_page.search(
    search_input: @expected_search_result.to_s
  )
end

Then(/^I can access the user details$/) do
  # @front_app.licences_page.clickfirstlink(link: @expected_search_result)
  click_link(@expected_search_result, match: :first)
  expect(@front_app.user_details_page.caption).to have_text(@expected_user_type)
  expect(@front_app.user_details_page.heading).to have_text(@expected_search_result)
  expect(@front_app.user_details_page.content).to have_text("Last signed in")
  @front_app.user_details_page.nav_bar.view_licences_link.click
end

Given(/^I search for a partial licence name$/) do
  @expected_search_result = "Swynn"
  @expected_result_count = 1
  @front_app.licences_page.search(
    search_input: @expected_search_result.to_s
  )
end

Given(/^the correct search results are shown$/) do
  expect(@front_app.licences_page.content).to have_text(@expected_search_result.to_s)
  # Count the number of links. The page object to query differs based on search results.
  if @expected_search_result.include? "@"
    expect(@front_app.licences_page).to have_email_links count: @expected_result_count.to_i
  elsif @user_type == "external_user"
    expect(@front_app.licences_page).to have_licence_links_external count: @expected_result_count.to_i
  else
    expect(@front_app.licences_page).to have_licence_links_internal count: @expected_result_count.to_i
  end
end

Given(/^I enter a search term which does not exist on screen$/) do
  @expected_search_result = "marmite"
  @expected_result_count = 0
  @front_app.licences_page.search(
    search_input: @expected_search_result.to_s
  )
end

Given(/^I cannot see any licences$/) do
  expect(@front_app.licences_page).to have_text("No results found.")
end

Given(/^I remove a search term$/) do
  @expected_search_result = "/"
  @expected_result_count = @total_licences
  @front_app.licences_page.search(
    search_input: @expected_search_result.to_s
  )
end

Given(/^I can see the original number of licences$/) do
  if @user_type == "external_user"
    expect(@front_app.licences_page).to have_licence_links_external count: @total_licences.to_i
  else
    expect(@front_app.licences_page).to have_licence_links_internal count: @total_licences.to_i
  end
end

Given(/^I enter an email address on the licence holder's email field$/) do
  @expected_search_result = Quke::Quke.config.custom["data"]["accounts"]["external_user"].to_s
  @expected_result_count = 1
  @front_app.licences_page.search(
    search_input: Quke::Quke.config.custom["data"]["accounts"]["external_user"]
  )
end
