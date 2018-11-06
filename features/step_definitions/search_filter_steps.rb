Given(/^I select a second page of many licences$/) do
  @expected_search_result = "/"
  @expected_result_count = 50
  @front_app.licences_page.search(
    search_form: @expected_search_result.to_s
  )
  @front_app.licences_page.pagetwo.click
end

Given(/^I can see a full page of licences$/) do
  expect(@front_app.licences_page).to have_view_links count: @expected_result_count.to_i
end

Given(/^I can see the correct number of pagination links$/) do
  @environment = Quke::Quke.config.custom["environment"].to_s
  @expected_pages = Quke::Quke.config.custom["data"]["total_pages"][@environment]
  expect(@front_app.licences_page).to have_pagination_links count: @expected_pages.to_i + 2
  # +2 for the "Previous page" and "Next page" links - both are visible on p2.
end

Given(/^I search for (?:a|an) "([^"]*)" licence$/) do |licencetype|
  @environment = Quke::Quke.config.custom["environment"].to_s
  @expected_search_result = Quke::Quke.config.custom["data"]["licence_" + licencetype.to_s].to_s
  @front_app.licences_page.search(
    search_form: @expected_search_result.to_s
  )
end

Given(/^I search for a partial licence number$/) do
  @expected_search_result = "29/01/*G"
  @expected_result_count = 5
  @front_app.licences_page.search(
    search_form: @expected_search_result.to_s
  )
end

Given(/^all licences containing that term are shown on screen$/) do
  expect(@front_app.licences_page.content).to have_text(@expected_search_result.to_s)
  expect(@front_app.licences_page).to have_view_links count: @expected_result_count.to_i
end

Given(/^I search for a partial licence name$/) do
  @expected_search_result = "Swynn"
  @expected_result_count = 1
  @front_app.licences_page.search(
    search_form: @expected_search_result.to_s
  )
end

Given(/^I enter a search term which does not exist on screen$/) do
  @expected_search_result = "marmite"
  @expected_result_count = 0
  @front_app.licences_page.search(
    search_form: @expected_search_result.to_s
  )
end

Given(/^I cannot see any licences$/) do
  expect(@front_app.licences_page).to have_text("No results found.")
end

Given(/^I remove a search term$/) do
  @expected_search_result = "/"
  @expected_result_count = @total_licences
  @front_app.licences_page.search(
    search_form: @expected_search_result.to_s
  )
end

Given(/^I can see the original number of licences$/) do
  expect(@front_app.licences_page).to have_view_links count: @total_licences.to_i
end

Given(/^I enter an email address on the licence holder's email field$/) do
  @expected_search_result = Quke::Quke.config.custom["data"]["licence_one"].to_s
  @expected_result_count = 4
  @front_app.licences_page.search(
    email_form: Quke::Quke.config.custom["data"]["accounts"]["external_user"]
  )
end

Given(/^I can sort the table by headings$/) do

  # Sort by licence name
  find_link("Licence name").click # doesn't work in Safari
  expect(@front_app.licences_page.content.text).to have_text("Licence name ▲")

  # Sort by licence number:
  find_link("Licence number").click
  @environment = Quke::Quke.config.custom["environment"].to_s
  @top_licence = Quke::Quke.config.custom["data"]["licence_top"].to_s
  @btm_licence = Quke::Quke.config.custom["data"]["licence_bottom"].to_s
  expect(@front_app.licences_page.content.text).to have_text("Licence number ▲")
  expect(page.body.index(@top_licence)).to be < page.body.index(@btm_licence)

  # Sort by licence end date
  find_link("End date").click
  expect(@front_app.licences_page.content.text).to have_text("End date ▲")

end
