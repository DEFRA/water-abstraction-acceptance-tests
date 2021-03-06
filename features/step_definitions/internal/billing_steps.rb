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
    expect(page.h1_heading).to have_text("supplementary bills")
  elsif bill_action_type.eql? "bill runs"
    @batch_list_page = Pages::Internal::Manage::BillRunBatchListPage.new
    expect(@batch_list_page).to have_text("Create a bill run")
  elsif bill_action_type.eql? "remove this bill"
    @remove_bill_page = Pages::Internal::Manage::RemoveBillRunPage.new
    expect(@remove_bill_page).to have_text("You're about to remove this bill from the supplementary bill run")
  elsif bill_action_type.eql? "send this bill run"
    @send_bill_run_page = Pages::Internal::Manage::SendBillRunPage.new
    expect(@send_bill_run_page).to have_text("You are about to send this bill run")
  elsif bill_action_type.eql? "Supplementary bill run"
    @batch_list_page = Pages::Internal::Manage::BillRunBatchListPage.new
    expect(@batch_list_page).to have_text("Supplementary bill run")
  elsif bill_action_type.eql? "Annual bill run"
    @batch_list_page = Pages::Internal::Manage::BillRunBatchListPage.new
    expect(@batch_list_page).to have_text("Annual bill run")
  elsif bill_action_type.eql? "Review licences"
    @two_part_tariff_review_page = Pages::Internal::Manage::TwoPartTariffReviewPage.new
    expect(@two_part_tariff_review_page).to have_text("Review licences with returns data issues")
  end
end

Then("I can't see the billing section") do
  page = Pages::Internal::ManagePage.new
  expect(page).to have_no_text("Create a bill run")
  expect(page).to have_no_text("View past and open bill runs")
end

Then("I click on view link of a bill") do
  @batch_list_page = Pages::Internal::Manage::BillRunBatchListPage.new
  @batch_list_page.view_bill
end

Then("I click on Other abstractors tab") do
  @annual_page = Pages::Internal::Manage::AnnualBillPage.new
  @annual_page.click_other_abstrators_tab
end

Then("I click on view link of an Annual bill") do
  @annual_page = Pages::Internal::Manage::AnnualBillPage.new
  @annual_page.click_view_link
end

Then("I click on Remove from bill run button") do
  @page.click_remove_bill_link
end

Then("I click on back link") do
  @page.click_back_link
end

Then("I click on Confirm bill run button") do
  @page.click_confirm_bill_run_link
end

Then("I click on Confirm button") do
  @page.click_confirm_button
  sleep 50
end

Then("I click on Send bill run button") do
  @send_bill_run_page = Pages::Internal::Manage::SendBillRunPage.new
  @send_bill_run_page.click_send_bill_run
end

Then("I click on Remove bill button") do
  @remove_bill_page = Pages::Internal::Manage::RemoveBillRunPage.new
  @remove_bill_page.click_remove_bill_run
end

Then("I click on Review link of a bill") do
  @two_part_tariff_review_page = Pages::Internal::Manage::TwoPartTariffReviewPage.new
  @two_part_tariff_review_page.click_review
end

Then("I click change on Review returns data issues") do
  @two_part_tariff_review_page = Pages::Internal::Manage::TwoPartTariffReviewPage.new
  @two_part_tariff_review_page.click_change
end

Then("I select the {string} billable quantity for this bill run") do |billable_quantity_type|
  @two_part_tariff_review_page = Pages::Internal::Manage::TwoPartTariffReviewPage.new
  @two_part_tariff_review_page.the_billable_quantity(billable_quantity_type)
end

Then("I click on Continue button") do
  @page.click_continue_button
end

Then("I click on Continue1 button") do
  @page.click_continue1_button
end

Then("I remove {int} bill runs") do |bill_runs_count|
  @two_part_tariff_review_page = Pages::Internal::Manage::TwoPartTariffReviewPage.new
  @two_part_tariff_review_page.remove_bill_runs(bill_runs_count)
end
