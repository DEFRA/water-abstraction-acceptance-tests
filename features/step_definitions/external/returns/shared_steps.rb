Given("I navigate to the external {string} {string} return") do |return_status, frequency|
  return_data = @test_data.current_licences_with_returns["returns"] if return_status == "due"
  return_id = return_data[frequency]["return_id"]

  page = Pages::External::Returns::HasWaterBeenAbstracted.new
  page.load(returnId: return_id)
end

And("I submit nothing on the {string} page") do |question_text|
  page = Pages::External::Returns.page_from_question question_text
  page.continue_button.click
end

Then("I submit a valid answer and am routed to the expected page") do |table|
  table.hashes.each do |journey|
    frequency = journey["return_frequency"]
    return_data = @test_data.current_licence_return(frequency)
    return_id = return_data["return_id"]

    origin_page = Pages::External::Returns.page_from_question(journey["origin"])

    origin_page.load(returnId: return_id)
    origin_page.submit_answer(journey["answer"])

    destination_page = Pages::External::Returns.page_from_question(journey["destination"])
    expect(destination_page).to be_displayed
    expect(destination_page.current_url).to end_with(return_id)
  end
end

And("I progress through the external returns flow") do |table|

  table.hashes.each_with_index do |journey, index|
    frequency = journey["return_frequency"]
    return_data = @test_data.current_licence_return(frequency)
    return_id = return_data["return_id"]

    origin_page = Pages::External::Returns.page_from_question(journey["origin"])

    # only load the first page and rely of the submission of pages
    # for all future navigation
    origin_page.load(returnId: return_id) if index.zero?
    expect(origin_page).to be_displayed

    origin_page.submit_answer(journey["answer"])
  end
end

Then("the {string} page displays the expected details for the {string} return") do |question_text, return_frequency|
  return_data = @test_data.current_licence_return(return_frequency)
  assertions = ReturnPageDetailExpectations.new(question_text, return_data)
  assertions.assert
end

Given("I submit no answer on the {string} page") do |page_text|
  page = Pages::External::Returns.page_from_question(page_text)
  page.submit_answer
end

Given("I answer {string} on the {string} page") do |response, page_text|
  page = Pages::External::Returns.page_from_question(page_text)
  page.submit_answer response
end

Given("I choose {string} on the {string} page") do |response, page_text|
  page = Pages::External::Returns.page_from_question(page_text)
  page.choose_answer response
end

Then("I am on the {string} page of the external returns flow") do |page_text|
  page = Pages::External::Returns.page_from_question(page_text)
  expect(page).to be_displayed
end

# This class groups together the tests for the display of each of
# the returns pages.
#
# These tests ensure that when the user lands on a returns page,
# the expected controls, and returns data are displayed.
class ReturnPageDetailExpectations
  include RSpec::Matchers

  # Initialize with the question text and the data for the return under test
  #
  # The question test will be used to select the appropriate page
  # that the #assert method can be called generically facilitating tests
  # that use data tables
  def initialize(question_text, return_data)
    @page = Pages::External::Returns.page_from_question(question_text)
    @return_data = return_data

    # this hash maps the question text to the name of the method that should be
    # used to test the page under test
    @assertions = {
      Pages::External::Returns::HAVE_YOU_ABSTRACTED_WATER => "assert_has_water_been_abstracted_details",
      Pages::External::Returns::NIL_RETURN => "assert_nil_return_details",
      Pages::External::Returns::METER_DETAILS => "assert_meter_details",
      Pages::External::Returns::SUBMITTED => "assert_submitted_details",
      Pages::External::Returns::HOW_FIGURES_REPORTED => "assert_how_figures_reported_details",
      Pages::External::Returns::DID_METER_RESET => "assert_did_meter_reset_details",
      Pages::External::Returns::ENTER_METER_READINGS => "assert_meter_readings",
      Pages::External::Returns::ENTER_VOLUMES => "assert_enter_volumes"
    }
    @question_text = question_text
  end

  def assert
    assert_heading_details
    method_name = @assertions[@question_text]
    send method_name
  end

  private

  def assert_has_water_been_abstracted_details
    expect(@page.question).to have_text("Have you abstracted water in this return period?")
    assert_return_details
  end

  def assert_return_details
    description = @return_data["metadata"]["description"]
    purpose = @return_data["metadata"]["purposes"][0]["alias"]

    expect(@page.return_details.site_description_text).to eq(description)
    expect(@page.return_details.purpose_text).to eq(purpose)
    expect(@page.return_details.return_period_text).to match(/^\d{1,2} \w{3,9} \d{4} to \d{1,2} \w{3,9} \d{4}$/)
    expect(@page.return_details.abstraction_period_text).to match(/^\d{1,2} \w{3,9} to \d{1,2} \w{3,9}$/)
  end

  def assert_nil_return_details
    expect(@page.sub_heading).to have_text("Nil return")
    assert_return_details
  end

  def assert_meter_details
    expect(@page.sub_heading).to have_text("Your current meter details")
    expect(@page).to have_manufacturer
    expect(@page).to have_serial_number
    expect(@page).to have_multiplier
  end

  # rubocop:disable Metrics/AbcSize
  def assert_submitted_details
    return_id = @return_data["return_id"]
    metadata = @return_data["metadata"]

    expect(@page.title).to have_text("Return submitted")
    expect(@page.details).to have_text(@return_data["licence_ref"])
    expect(@page.details).to have_text(metadata["description"])
    expect(@page.details).to have_text(metadata["purposes"][0]["alias"])
    expect(@page.view_return_link).to have_text("View this return")
    expect(@page.view_return_link["href"]).to end_with("/returns/return?id=#{return_id}")
  end
  # rubocop:enable Metrics/AbcSize

  def assert_how_figures_reported_details
    expect(@page.question).to have_text("How are you reporting your figures?")
    expect(@page).to have_meter_readings
    expect(@page).to have_volumes
    expect(@page).to have_estimates
  end

  def assert_did_meter_reset_details
    expect(@page.question).to have_text("Did your meter reset in this abstraction period?")
    expect(@page).to have_yes
    expect(@page).to have_no
  end

  def assert_meter_readings
    expect(@page.sub_heading).to have_text("Enter your readings exactly as they appear on your meter")
    expect(@page).to have_start_reading
    expect(@page.meter_readings.size).to be > 1
  end

  def assert_enter_volumes
    expect(@page.sub_heading).to have_text("Your abstraction volumes")
    expect(@page.volumes.size).to be > 1
  end

  def assert_heading_details
    return if @question_text == Pages::External::Returns::SUBMITTED

    licence_number = @return_data["licence_ref"]

    expect(@page.heading).to have_text("Abstraction return")
    expect(@page.licence_number).to have_text("Licence number #{licence_number}")
  end
end
