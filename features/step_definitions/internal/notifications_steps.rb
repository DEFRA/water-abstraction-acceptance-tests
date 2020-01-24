When(/^I successfully send paper forms$/) do
  @page.send_paper_forms
  @paper_forms_page = Pages::Internal::Manage::SendPaperForms.new
  expect(@paper_forms_page.current_url).to include("/returns-notifications/forms")
  @paper_forms_page.submit_valid_licence_numbers(@test_data.current_licence_return["licence_ref"])

  @paper_forms_confirm_page = Pages::Internal::Manage::SendPaperFormsConfirm.new
  expect(@paper_forms_confirm_page.current_url).to include("returns-notifications/forms")
  expected_warning_text = "You are about to send paper return forms for the following licences."
  expect(@paper_forms_confirm_page.warning_text).to have_text(expected_warning_text)
  @paper_forms_confirm_page.send_paper_forms
end

Then(/^I can see the paper forms success page$/) do
  @paper_forms_sent_page = Pages::Internal::Manage::PaperFormsSentConfirmation.new
  expect(@paper_forms_sent_page.current_url).to include("returns-notifications/forms-success")
  expect(@paper_forms_sent_page.confirmation_message_title).to have_text("Paper forms have been sent")
  expect(@paper_forms_sent_page.confirmation_message_body).to have_text("They should arrive within the next five days")
  expect(@paper_forms_sent_page.notices_report_link).to have_text("See report for notices")
end