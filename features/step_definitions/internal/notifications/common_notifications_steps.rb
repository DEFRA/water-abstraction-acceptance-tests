Given(/^I navigate to the "([^"]*)" page$/) do |notification_type|
  if notification_type.eql? "paper forms"
    @page.click_paper_forms
    @notifications_page = Pages::Internal::Manage::SendPaperForms.new
  elsif notification_type.eql? "returns invitations"
    @page.click_invitations
    @notifications_page = Pages::Internal::Manage::ReturnsInvitations.new
  elsif notification_type.eql? "returns reminders"
    @page.click_reminders
    @notifications_page = Pages::Internal::Manage::ReturnsReminders.new
  end
  url_parts = notification_type.split(" ")
  expect(@notifications_page.current_url).to include("/returns-notifications/#{url_parts.last}")
end

When(/^I exclude ([^"]*) licences$/) do |licence|
  if licence.eql? "some"
    licence_numbers = "AT/CURR/DAILY/01, AT/CURR/WEEKLY/01, AT/CURR/MONTHLY/01"
    @notifications_page.generate_returns_invitations(licence_numbers)
  elsif licence.eql? "no"
    @notifications_page.generate_returns_invitations
  end
end

Then(/^I can see the "([^"]*)" waiting page$/) do |notification_type|
  @waiting_page = Pages::Internal::Manage::Waiting.new
  url_regex = %r{^https://([a-z.-]+)/waiting/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$}
  expect(@waiting_page.current_url).to match(url_regex)
  expect(@waiting_page.h1_heading).to have_text("Send #{notification_type}")
  # rubocop:disable Layout/LineLength
  expected_message = "Please wait while the mailing list is assembled. This may take a few minutes. The letters will not be sent yet."
  # rubocop:enable Layout/LineLength
  expect(@waiting_page.waiting_page_message).to have_text(expected_message)
end

Then(/^I can confirm sending the "([^"]*)"$/) do |notification_type|
  if notification_type.eql? "returns invitations"
    @send_notifications = Pages::Internal::Manage::SendReturnsInvitations.new
  elsif notification_type.eql? "returns reminders"
    @send_notifications = Pages::Internal::Manage::SendReturnsReminders.new
  end
  @send_notifications.wait_until_mailing_list_message_visible
  url_regex = %r{^https:\/\/([a-z.-]+)\/batch-notifications\/review\/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$}
  expect(@send_notifications.current_url).to match(url_regex)
  expect(@send_notifications.h1_heading).to have_text("Send #{notification_type}")
  expect(@send_notifications.mailing_list_message).to have_text("Mailing list is ready to send.")
  expect(@send_notifications.csv_download_link).to have_text("Download recipients as a CSV file.")
  @send_notifications.send_letters
end

Then(/^I can see the "([^"]*)" success page$/) do |notification_type|
  if notification_type.eql? "return invitations"
    @success_page = Pages::Internal::Manage::ReturnsInvitationsSuccess.new
  elsif notification_type.eql? "return reminders"
    @success_page = Pages::Internal::Manage::ReturnsRemindersSuccess.new
  end
  expect(@success_page.confirmation_message_title).to have_text("#{notification_type.capitalize} sent")
  reference_number_regex = /^Your reference number(\r\n|\n|\r)\w{4}-\w{6}$/
  expect(@success_page.confirmation_message_body.text).to match(reference_number_regex)
  expect(@success_page.view_report_link).to have_text("View report")
end

Then(/^I can't see the "([^"]*)" link$/) do |notification_type|
  link_text = {
    "paper forms" => "Paper forms",
    "returns invitations" => "Invitations",
    "returns reminders" => "Reminders"
  }
  page = Pages::Internal::ManagePage.new
  expect(page).to have_no_text(link_text[notification_type])
end
