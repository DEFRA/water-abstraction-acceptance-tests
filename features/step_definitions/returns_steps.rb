
Given(/^I can access my returns overview$/) do
  expect(production?).to be false
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
    expect(@front_app.return_details_page.heading_mini).to have_text("Nil return")

  elsif @return_type == "null"
    @return_licence_link = Quke::Quke.config.custom["data"]["return_null"].to_s

  elsif @return_type == "the most recent"
    @front_app.licence_details_page.clickfirstlink(link: @licence_one)
    @return_licence_link = @licence_one

  end
  # Two lines here, because the heading wording order varies depending if licence has a name or not.
  expect(@front_app.return_details_page.heading).to have_text("Abstraction return for")
  expect(@front_app.return_details_page.heading).to have_text(@return_licence_link)
end

Given(/^I can't see the NALD reference$/) do
  expect(@front_app.return_details_page.content).to have_no_text("Return reference")
end

Given(/^I can check the licence details$/) do
  @front_app.return_details_page.view_licence_link.click
  expect(@front_app.licence_details_page.heading).to have_text(@return_licence_link)
  expect(@front_app.licence_details_page.content).to have_text("Source of supply")
  @front_app.licence_details_page.nav_bar.returns_link.click
end

Given(/^I select a licence I can access$/) do
  @licence_one = Quke::Quke.config.custom["data"]["licence_one"].to_s

  if @user_type == "internal_user"
    # Internal user must for the licence first:
    @front_app.licences_page.search(search_input: @licence_one)
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
  expect(@front_app.licence_details_page).to have_returns_tab
  @front_app.licence_details_page.returns_tab.click
  @return_type = ""
  expect(@front_app.licence_details_page.visible_subheading).to have_text("Returns")
  expect(@front_app.licence_details_page.heading).to have_text(@licence_one)
end

Given(/^the earliest return date is not earlier than the transfer date$/) do
  # This test fails because of WATER-1610 bugfix.
  # To use, need an external user to register a licence that has been transferred rather than just varied.
  # Works by putting all return years (4 digit numbers) in the table into an array, to compare them:
  # Syntax from https://www.regular-expressions.info/ruby.html
  # rubocop:disable Metrics/LineLength
  @return_years = @front_app.licence_details_page.returns_table.text.scan(/[[:digit:]][[:digit:]][[:digit:]][[:digit:]]/)
  # rubocop:enable Metrics/LineLength
  puts "Return years: " + @return_years.to_s
  @earliest_return_year = @return_years.min.to_i
  expect(@earliest_return_year).to be >= @earliest_version_year
end

Given(/^I "([^"]*)" a return of type "([^"]*)"$/) do |action, flow|
  # Given I "edit" or "submit" a return of type "nil", "volume", "meter", or "multi meter"
  expect(production?).to be false

  @return_action = action.to_s
  @return_flow = flow.to_s

  # Edit or submit a return using a particular flow.

  # Decide whether to start on the edit or submit path:
  @licence_returns = Quke::Quke.config.custom["data"]["licence_returns"].to_s

  if action == "edit"
    @front_app.licences_page.search(search_input: @licence_returns)
    find_link(@licence_returns).click
    @front_app.licence_details_page.returns_tab.click
    @front_app.licence_details_page.first_return.click

    # TEMPORARY STEP to select the action to submit the return.
    # Remove this and uncomment the next step once WATER-1954 is fixed.
    @front_app.return_routes_page.first_action_radio.click

    # Next step is temporarily broken due to bug WATER-1954
    # @front_app.return_details_page.edit_return_button.click

    # Should show "enter and submit return" and "log a problem" options.
    expect(@front_app.return_routes_page.heading).to have_text("Abstraction return for")
    expect(@front_app.return_routes_page.question).to have_text("What do you want to do with this return?")
    @front_app.return_routes_page.enter_radio.click
    @front_app.return_routes_page.continue_button.click

  elsif action == "submit"
    # Not yet built.  Access the required licence's list of returns as an external user.
    find_link(@licence_returns).click
    @front_app.licence_details_page.returns_tab.click
    @front_app.licence_details_page.first_return.click

  end

  # Returns routes pages
  # Use assertions to check the right options exist
  expect(@front_app.return_routes_page.question).to have_text("Has any water been abstracted in this return period?")
  if @return_flow == "nil"
    # Report a nil return
    @front_app.return_routes_page.no_radio.click
    @front_app.return_routes_page.continue_button.click
    expect(@front_app.return_routes_page.nil_return_heading).to have_text("Nil return")
    @front_app.return_routes_page.continue_button.click
  else
    # There are amounts to report
    @front_app.return_routes_page.yes_radio.click
    @front_app.return_routes_page.continue_button.click
    expect(@front_app.return_routes_page.question).to have_text("How are you reporting your return?")

    if @return_flow == "volume" || @return_flow == "multi meter"
      # Report a volume with no meters
      @front_app.return_routes_page.method_volume_radio.click
      @front_app.return_routes_page.continue_button.click

      expect(@front_app.return_routes_page.question).to have_text("What is the unit of measurement?")
      # If changing to/from m3 then the validation for table_total or table_total_first will change
      @return_unit = "Cubic metres"
      @front_app.return_routes_page.unit_m3_radio.click
      @front_app.return_routes_page.continue_button.click

      if @return_action == "edit"
        # An internal user editing a return has this as an extra question:
        expect(@front_app.return_routes_page.question).to have_text("Is it a single amount of abstracted water?")
        @front_app.return_routes_page.no_radio.click
        @front_app.return_routes_page.continue_button.click
      end

      # rubocop:disable Metrics/LineLength
      expect(@front_app.return_routes_page.question).to have_text("Did you use a meter (or meters) to calculate the volumes?")
      # rubocop:enable Metrics/LineLength
      if @return_flow == "volume"
        # No meters used
        @front_app.return_routes_page.no_radio.click
        @front_app.return_routes_page.continue_button.click
      end

      if @return_flow == "multi meter"
        # Multiple meters used
        @front_app.return_routes_page.yes_radio.click
        @front_app.return_routes_page.continue_button.click

        # Add info for one of your meters
        expect(@front_app.return_routes_page.question).to have_text("Tell us about your meter")
        @front_app.return_routes_page.submit(
          manufacturer: "Schofield Meter Co",
          serial: "081-811-8181"
        )
      end

      # Enter random quantities including blanks, and set @abstraction_total as the total entered.
      @abstraction_total = @front_app.return_quantities_page.populate_volumes
      @front_app.return_quantities_page.submit_button.click

    elsif @return_flow == "one meter"
      # Single meter
      @front_app.return_routes_page.method_meter_radio.click
      @front_app.return_routes_page.continue_button.click

      expect(@front_app.return_routes_page.question).to have_text("Tell us about your meter")
      # If adding a x10 step, add it here.
      @front_app.return_routes_page.submit(
        manufacturer: "Gopher Meter Co",
        serial: "081-811-8181",
        start_reading: "0"
      )

      expect(@front_app.return_routes_page.question).to have_text("What is the unit of measurement?")
      @return_unit = "Gallons"
      @front_app.return_routes_page.unit_gal_radio.click
      @front_app.return_routes_page.continue_button.click

      expect(@front_app.return_quantities_page.heading_mini).to have_text("Meter readings")
      # Enter random non-decreasing readings including blanks, and set @abstraction_total as the total entered.
      @abstraction_total = @front_app.return_quantities_page.populate_meter_readings
      @front_app.return_quantities_page.submit_button.click

    end

    # Check that the abstraction info in the table is correct
    expect(@front_app.return_check_page.heading_mini).to have_text("Check the information before submitting")

    # Compare the table's total with the calculated abstraction total, in the submitted units.
    table_total = if @return_flow == "volume" || @return_flow == "multi meter"
                    # There's only one figure at the bottom of the table
                    @front_app.return_check_page.table_total.text
                  elsif @return_flow == "one meter"
                    # There's more than one figure at the bottom of the table, so read the first
                    @front_app.return_check_page.table_total_first.text
                  end
    # Remove commas from the total in the table:
    table_total.tap { |s| s.delete!(",") }
    expect(table_total.to_i).to eq(@abstraction_total.to_i)

    # Submit the return
    @front_app.return_check_page.submit_button.click

  end

  expect(@front_app.return_submitted_page.confirmation_box).to have_text("Return submitted")
  expect(@front_app.return_submitted_page.confirmation_box).to have_text(@licence_returns)

  # These tests may be expanded by:
  # Submitting a single value and checking it populates in the abstraction period.
  # Following alternative flows: one/multiple meters, varying and checking the units.

end

Given(/^I can view the return I just submitted$/) do
  @front_app.return_submitted_page.view_return_link.click
  expect(@front_app.return_details_page.heading).to have_text(@licence_returns)

  if @return_flow == "nil"
    # Check it's a nil return
    expect(@front_app.return_details_page.heading_mini).to have_text("Nil return")

  elsif @return_flow == "volume" || @return_flow == "multi meter"
    # Check the volume in the table against what was entered
    expect(@front_app.return_details_page.heading_mini).to have_text("Abstraction volumes")
    expect(@front_app.return_details_page.data_table).to have_text(@return_unit)
    # Read total from bottom of table, removing commas:
    table_total = @front_app.return_details_page.table_total.text.tap { |s| s.delete!(",") }
    expect(table_total.to_i).to eq(@abstraction_total.to_i)

  elsif @return_flow == "one meter"
    # Check the volume in the table against what was entered
    expect(@front_app.return_details_page.heading_mini).to have_text("Abstraction volumes")
    expect(@front_app.return_details_page.data_table_full).to have_text(@return_unit)
    # Read total from bottom of table, removing commas:
    table_total = @front_app.return_details_page.table_total_first.text.tap { |s| s.delete!(",") }
    expect(table_total.to_f.round).to eq(@abstraction_total.round)
  end

  # Go back to licences page:
  @front_app.return_details_page.nav_bar.view_licences_link.click

end
