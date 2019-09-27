Given("I navigate to the external {string} test return") do |return_status|

  return_data = @test_data.current_licence_with_return["return"] if return_status == "due"
  return_id = return_data["return_id"]

  page = ExternalReturnsHasWaterBeenAbstractedPage.new
  page.load(returnId: return_id)
end

Then("I submit a valid answer and am routed to the expected page") do |table|

  return_data = @test_data.current_licence_with_return["return"]
  return_id = return_data["return_id"]

  table.hashes.each do |journey|
    origin_page = external_returns_page_from_question(journey["origin"])

    origin_page.load(returnId: return_id)
    origin_page.submit_answer(journey["answer"])

    destination_page = external_returns_page_from_question(journey["destination"])
    expect(destination_page).to be_displayed
    expect(destination_page.current_url).to end_with(return_id)
  end
end
