
Given(/^I can access my returns overview$/) do
  expect(@front_app.licences_page.nav_bar).to have_returns_link
  @front_app.licences_page.nav_bar.returns_link.click
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
    # Remove commas from the reading.  Syntax:
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
    @front_app.returns_for_licence_page.clickfirstlink(link: @licence_one)
    @return_licence_link = @licence_one
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
  @front_app.licence_details_page.nav_bar.returns_link.click
end

Given(/^I select a licence I can access$/) do
  @licence_one = Quke::Quke.config.custom["data"]["licence_one"].to_s
  if @user_type == "internal_user"
    # Internal user must for the licence first:
    @front_app.licences_page.search(search_form: @licence_one)
  end
  find_link(@licence_one).click
  expect(@front_app.licence_details_page.heading).to have_text(@licence_one)
  # Get the start year for the version, for returns tests.
  # rubocop:disable Metrics/LineLength
  @version_years = @front_app.licence_details_page.licence_date_info.text.scan(/[[:digit:]][[:digit:]][[:digit:]][[:digit:]]/)
  # rubocop:enable Metrics/LineLength
  @earliest_version_year = @version_years.min.to_i
end

Given(/^I can view all returns for the licence$/) do
  expect(@front_app.licence_details_page.content).to have_text("Returns for this licence")
  expect(@front_app.licence_details_page.content).to have_text("View returns")
  @front_app.licence_details_page.view_returns_for_licence.click
  @return_type = ""
  expect(@front_app.returns_for_licence_page.heading).to have_text("Returns for")
  expect(@front_app.returns_for_licence_page.heading).to have_text(@licence_one)
end

Given(/^the earliest return date is not earlier than the transfer date$/) do
  # This test fails because of WATER-1610 bugfix.
  # To use, need an external user to register a licence that has been transferred rather than just varied.
  # Works by putting all return years (4 digit numbers) in the table into an array, to compare them:
  # Syntax from https://www.regular-expressions.info/ruby.html
  # rubocop:disable Metrics/LineLength
  @return_years = @front_app.returns_for_licence_page.returns_table.text.scan(/[[:digit:]][[:digit:]][[:digit:]][[:digit:]]/)
  # rubocop:enable Metrics/LineLength
  @earliest_return_year = @return_years.min.to_i
  expect(@earliest_return_year).to be >= @earliest_version_year
end

Given(/^I "([^"]*)" a return of type "([^"]*)"$/) do |action, flow|
  @return_flow = flow.to_s
  # Edit or submit a return using a particular flow.
  @environment = Quke::Quke.config.custom["environment"].to_s
  # Failsafe to stop test in production:
  expect(2 + 2).to eq(5) if @environment == "prod"
  # Decide whether to start on the edit or submit path:
  @licence_returns = Quke::Quke.config.custom["data"]["licence_returns"].to_s
  if action == "edit"
    @front_app.licences_page.search(search_form: @licence_returns)
    find_link(@licence_returns).click
    @front_app.licence_details_page.view_returns_for_licence_int.click
    find_link("November 2017 to October 2018").click
    @front_app.return_details_page.edit_return_button.click
  elsif action == "submit"
    # Not yet built.  Access the required licence's list of returns as an external user.
    find_link(@licence_returns).click
    @front_app.licence_details_page.view_returns_for_licence.click
  end
  # Returns routes pages
  # Use assertions to check the right options exist
  expect(@front_app.returns_routes_page.heading).to have_text("Abstraction return for")
  expect(@front_app.returns_routes_page.question).to have_text("Are there any abstraction amounts to report")
  if flow == "nil"
    # Nil return flow
    @front_app.returns_routes_page.no_radio.click
    @front_app.returns_routes_page.continue_button.click
    expect(@front_app.returns_routes_page.nil_return_heading).to have_text("Nil return")
    @front_app.returns_routes_page.continue_button.click
  end
  expect(@front_app.return_submitted_page.confirmation_box).to have_text("Return submitted")
  expect(@front_app.return_submitted_page.confirmation_box).to have_text(@licence_returns)
end

Given(/^I can view the return I just submitted$/) do
  @front_app.return_submitted_page.view_return_link.click
  if @return_flow == "nil"
    expect(@front_app.return_details_page.heading).to have_text(@licence_returns)
    expect(@front_app.return_details_page.nil_return).to have_text("Nil return")
  end

end
