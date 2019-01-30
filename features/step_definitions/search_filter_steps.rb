Given(/^I select a second page of many licences$/) do
  @expected_search_result = "/"
  @expected_result_count = 50
  @front_app.licences_page.search(
    search_input: @expected_search_result.to_s
  )
  @front_app.licences_page.pagetwo.click
end

Given(/^I can see a full page of licences$/) do
  expect(@front_app.licences_page).to have_licence_links count: @expected_result_count.to_i
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

Given(/^the correct search results are shown$/) do
  expect(@front_app.licences_page.content).to have_text(@expected_search_result.to_s)
  # Count the number of links. The page object to query differs based on search results.
  if @expected_search_result.include? "@"
    expect(@front_app.licences_page).to have_email_links count: @expected_result_count.to_i
  else
    expect(@front_app.licences_page).to have_licence_links count: @expected_result_count.to_i
  end
end

Given(/^I search for a partial licence name$/) do
  @expected_search_result = "Swynn"
  @expected_result_count = 1
  @front_app.licences_page.search(
    search_input: @expected_search_result.to_s
  )
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
  expect(@front_app.licences_page).to have_licence_links count: @total_licences.to_i
end

Given(/^I enter an email address on the licence holder's email field$/) do
  @expected_search_result = Quke::Quke.config.custom["data"]["accounts"]["external_user"].to_s
  @expected_result_count = 1
  @front_app.licences_page.search(
    search_input: Quke::Quke.config.custom["data"]["accounts"]["external_user"]
  )
end
