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

Given(/^I search for an expired licence$/) do
  @expected_search_result = Quke::Quke.config.custom["data"]["licence_expired"].to_s
  @front_app.licences_page.search(
    search_form: @expected_search_result.to_s
  )
end

Given(/^I search for a revoked licence$/) do
  @environment = Quke::Quke.config.custom["environment"].to_s
  @expected_search_result = Quke::Quke.config.custom["data"]["licence_revoked"].to_s
  @front_app.licences_page.search(
    search_form: @expected_search_result.to_s
  )
end

Given(/^I search for a lapsed licence$/) do
  @environment = Quke::Quke.config.custom["environment"].to_s
  @expected_search_result = Quke::Quke.config.custom["data"]["licence_lapsed"].to_s
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

Given(/^I select the licence name heading$/) do
  # @front_app.licences_page.sort_by_name_link.click # ambiguous
  @front_app.licences_page.submit(licence: "Licence name") # doesn't work in Safari
end

Given(/^the table is sorted by licence name in ascending order$/) do
  expect(@front_app.licences_page.content.text).to have_text("Licence name ▲")
end

Given(/^I select the end date heading$/) do
  # @front_app.licences_page.sort_by_end_date_link.click # ambiguous
  @front_app.licences_page.submit(licence: "End date") # doesn't work in Safari
end

Given(/^the table is sorted by end date in ascending order$/) do
  expect(@front_app.licences_page.content.text).to have_text("End date ▲")
end

Given(/^I select the licence number heading$/) do
  # @front_app.licences_page.sort_by_number_link.click # ambiguous
  @front_app.licences_page.submit(licence: "Licence number") # doesn't work in Safari
end

Given(/^the table is sorted by licence number in ascending order$/) do
  @environment = Quke::Quke.config.custom["environment"].to_s
  @top_licence = Quke::Quke.config.custom["data"]["licence_top"].to_s
  @btm_licence = Quke::Quke.config.custom["data"]["licence_bottom"].to_s
  expect(@front_app.licences_page.content.text).to have_text("Licence number ▲")
  expect(page.body.index(@top_licence)).to be < page.body.index(@btm_licence)
end

Given(/^I enter an email address on the licence holder's email field$/) do
  @expected_search_result = @licence_reg
  @expected_result_count = 50
  @front_app.licences_page.search(
    email_form: @reg_email
  )
end
