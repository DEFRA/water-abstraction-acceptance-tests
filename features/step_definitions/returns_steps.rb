
Given(/^I can access my returns overview$/) do
  expect(@front_app.licences_page).to have_returns_link
  @front_app.licences_page.returns_link.click
  expect(@front_app.returns_page.heading).to have_text("Your returns")
  expect(@front_app.returns_page.content).to have_text("View return from")
  expect(@front_app.returns_page.content).to have_text("Potable Water Supply")
end

Given(/^I can view a return that is "([^"]*)"$/) do |returntype|
  @return_type = returntype
  if @return_type == "populated daily"
    @return_licence_link = Quke::Quke.config.custom["data"]["return_day"].to_s
    @front_app.returns_page.clickfirstlink(link: @return_licence_link)
    @first_reading = @front_app.return_details_page.first_reading.text
    # The following line removes commas from the reading.  Syntax:
    # https://stackoverflow.com/questions/30743686/remove-a-comma-from-string-in-ruby-then-cast-to-integer
    @first_reading.tap { |s| s.delete!(",") }
    @first_reading = @first_reading.to_f
    expect(@front_app.return_details_page.freq_heading).to have_text("Day")
    expect(@front_app.return_details_page.unit_heading).to have_text("Cubic metres")
    expect(@front_app.return_details_page.data_table).to have_text("March")
    expect(@first_reading).to be > 0
  elsif @return_type == "nil"
    @return_licence_link = Quke::Quke.config.custom["data"]["return_nil"].to_s
    @front_app.returns_page.clickfirstlink(link: @return_licence_link)
    expect(@front_app.return_details_page.nil_return).to have_text("Nil return")
  elsif @return_type == "null"
    @return_licence_link = Quke::Quke.config.custom["data"]["return_null"].to_s
  elsif @return_type == "the most recent"
    @front_app.returns_for_licence_page.clickfirstlink(link: @licence_own)
    @return_licence_link = @licence_own
  end
  # Two lines here, because the heading wording order varies depending if licence has a name or not.
  expect(@front_app.return_details_page.heading).to have_text("Abstraction return for")
  expect(@front_app.return_details_page.heading).to have_text(@return_licence_link)
end

Given(/^I can't see the NALD reference$/) do
  expect(@front_app.return_details_page.content).to have_no_text("NALD")
end

Given(/^I can check the licence details$/) do
  @front_app.return_details_page.view_licence_link.click
  expect(@front_app.licence_details_page.heading).to have_text("Licence number")
  expect(@front_app.licence_details_page.content).to have_text("Source of supply")
  @front_app.licence_details_page.returns_link.click
end

Given(/^I select a licence I own$/) do
  @licence_own = Quke::Quke.config.custom["data"]["licence_one"].to_s
  @front_app.licences_page.submit(licence: @licence_own)
  expect(@front_app.licence_details_page.heading).to have_text(@licence_own)
  # Get the start year for the version, for returns tests.
  # rubocop:disable Metrics/LineLength
  @version_years = @front_app.licence_details_page.licence_date_info.text.scan(/[[:digit:]][[:digit:]][[:digit:]][[:digit:]]/)
  # rubocop:enable Metrics/LineLength
  @earliest_version_year = @version_years.min.to_i
end

Given(/^I can view all returns for my licence$/) do
  expect(@front_app.licence_details_page.content).to have_text("Returns for this licence")
  expect(@front_app.licence_details_page.content).to have_text("View returns")
  @front_app.licence_details_page.view_returns_for_licence.click
  @return_type = ""
  expect(@front_app.returns_for_licence_page.heading).to have_text("Returns for")
  expect(@front_app.returns_for_licence_page.heading).to have_text(@licence_own)
end

Given(/^the earliest return date is not earlier than the current version start date$/) do
  # Put all return years (4 digit numbers) in the table into an array, to compare them:
  # Syntax from https://www.regular-expressions.info/ruby.html
  # rubocop:disable Metrics/LineLength
  @return_years = @front_app.returns_for_licence_page.returns_table.text.scan(/[[:digit:]][[:digit:]][[:digit:]][[:digit:]]/)
  # rubocop:enable Metrics/LineLength
  @earliest_return_year = @return_years.min.to_i
  expect(@earliest_return_year).to be >= @earliest_version_year
end

# If there's a licence with no returns, add negative tests here.
