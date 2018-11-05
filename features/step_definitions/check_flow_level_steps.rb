
Given(/^I select a licence with a "([^"]*)" condition$/) do |conditiontype|
  @environment = Quke::Quke.config.custom["environment"].to_s
  conditionvar = "licence_" + conditiontype.to_s
  @licence_number = Quke::Quke.config.custom["data"][conditionvar]["number"].to_s
  @gauging_station = Quke::Quke.config.custom["data"][conditionvar]["station"].to_s
  @front_app.licences_page.search(
    search_form: @licence_number.to_s
  )
  find_link(@licence_number).click
end

Given(/^I can see the correct "([^"]*)" data$/) do |conditiontype|
  @do_this_step = 1
  # In prod, this only works for flow.
  @do_this_step = 0 if (@environment == "prod") && (conditiontype != "flow")

  if @do_this_step == 1
    find_link("View data from").click
    expect(@front_app.flow_level_page.heading).to have_text("Data from")
    @data_reading = @front_app.flow_level_page.reading.text.to_f

    if (conditiontype == "flow") || (conditiontype == "level")
      expect(@front_app.flow_level_page.data_info).to have_text(conditiontype)
      @flow_level_data_url = "http://environment.data.gov.uk/flood-monitoring/id/stations/" + @gauging_station
      expect(@data_reading).to be > 0
      visit(@flow_level_data_url)
      expect(@front_app.flow_level_data.flow_level_data).to have_text("latestReading")
      page.go_back
    elsif conditiontype == "nodata"
      expect(@front_app.flow_level_page.reading).to have_text("Sorry, there is no data available")
    end
  end

end

Given(/^I can convert the units$/) do
  expect(@front_app.flow_level_page).to have_unit_selector
  @front_app.flow_level_page.select_unit(unit: "Cubic metres per second")
  @reading_m3s = @front_app.flow_level_page.reading.text.to_f
  @front_app.flow_level_page.select_unit(unit: "Megalitres per day")
  @reading_mld = @front_app.flow_level_page.reading.text.to_f
  @front_app.flow_level_page.select_unit(unit: "Cubic metres per day")
  @reading_m3d = @front_app.flow_level_page.reading.text.to_f
end

Given(/^The units are the correct ratio to each other$/) do
  # Add 0.05 to account for rounding errors.  Otherwise fails if decimals are >= .45 and < .5
  expect(((@reading_m3d / 86_400) + 0.05).round).to eq(@reading_m3s.round)
  expect(((@reading_m3d / 1_000) + 0.05).round).to eq(@reading_mld.round)
end

Given(/^I cannot see a flow or level data link$/) do
  expect(@front_app.licence_details_page.licence_date_info).to have_text("Current licence version")
  expect(@front_app.licence_details_page).to have_no_text("View data from")
end
