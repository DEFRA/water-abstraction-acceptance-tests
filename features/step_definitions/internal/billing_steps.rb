Given("I navigate to the {string} section") do |section|
  @back_app = BackOfficeApp.new
  expect(@back_app.back_office_start_page.heading).to have_text("Licences, users and returns")
  @page = Pages::Internal::ManagePage.new
  @page.click_tab section
  @base_page = BasePage.new
  expect(@base_page. h1_heading.text).to have_text("Manage reports and notices")
end

When(/^I trigger a "([^"]*)" bill run for ([^"]*) region$/) do |bill_run_type, region|
  @page.create_a_bill_run
  @bill_run_page = Pages::Internal::Manage::BillRunTypePage.new
  expect(@bill_run_page.current_url).to include("/billing/batch/type")
  @bill_run_page.submit_bill_run_type(bill_run_type)
  @region_type = Pages::Internal::Manage::SelectTheRegionPage.new
  @region_type.submit_region_type(region)
end

When("I select the past and open bill runs option") do
  @page.view_past_open_bill_runs
end

Then("I can see the {string}") do |bill_action_type|
  if bill_action_type.eql? "bill run started"
    page = Pages::Internal::Manage::BillRunConfirmationPage.new
    expect(page.h1_heading).to have_text("Bill run exist")
  elsif bill_action_type.eql? "bill runs"
    @batch_list_page = Pages::Internal::Manage::BillRunBatchListPage.new
    expect(@batch_list_page).to have_text("Create a bill run")
  end
end

Then("I can't see the billing section") do
  page = Pages::Internal::ManagePage.new
  expect(page).to have_no_text("Create a bill run")
  expect(page).to have_no_text("View past and open bill runs")
end
