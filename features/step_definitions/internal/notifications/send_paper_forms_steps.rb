When(/^I submit "([^"]*)" licence number$/) do |valid|
  if valid.eql? "valid"
    @notifications_page.submit_licence_numbers(@test_data.current_licence_return["licence_ref"])
    @paper_forms_confirm_page = Pages::Internal::Manage::SendPaperFormsConfirm.new
    expect(@paper_forms_confirm_page.current_url).to include("returns-notifications/forms")
    expected_warning_text = "You are about to send paper return forms for the following licences."
    expect(@paper_forms_confirm_page.warning_text).to have_text(expected_warning_text)
    @paper_forms_confirm_page.send_paper_forms
  elsif valid.eql? "invalid"
    invalid_licence_ref = "INVALID/REF/01"
    @notifications_page.submit_licence_numbers(invalid_licence_ref)
  end
end

Then(/^I can see the paper forms "([^"]*)" page$/) do |page_type|
  if page_type.eql? "success"
    @paper_forms_sent_page = Pages::Internal::Manage::PaperFormsSentConfirmation.new
    expect(@paper_forms_sent_page.current_url).to include("returns-notifications/forms-success")
    expect(@paper_forms_sent_page.confirmation_message_title).to have_text("Paper forms have been sent")
    message_body = "They should arrive within the next five days"
    expect(@paper_forms_sent_page.confirmation_message_body).to have_text(message_body)
    expect(@paper_forms_sent_page.notices_report_link).to have_text("See report for notices")
  elsif page_type.eql? "issue"
    @paper_forms_issue_page = Pages::Internal::Manage::SendPaperFormsIssue.new
    expect(@paper_forms_issue_page.current_url).to include("returns-notifications/forms")
    expect(@paper_forms_issue_page.invalid_licence_numbers).to have_text(invalid_licence_ref)
  end
end

When(/^I submit an empty form$/) do
  @notifications_page.submit_empty_form
end

Then(/^the send paper forms page displays validation errors$/) do
  error_message = "Enter at least one licence number"
  expect(@notifications_page.error_summary.heading).to have_text("There is a problem")
  expect(@notifications_page.error_summary.links.first).to have_text(error_message)
  expect(@notifications_page.licence_numbers_error).to have_text(error_message)
end
