When(/^I exclude ([^"]*) licences$/) do |licence|
  if licence.eql? "some"
    licence_numbers = "AT/CURR/DAILY/01, AT/CURR/WEEKLY/01, AT/CURR/MONTHLY/01"
    @returns_invitations_page.generate_returns_invitations(licence_numbers)
  elsif licence.eql? "no"
    @returns_invitations_page.generate_returns_invitations
  end
end

Then(/^I can see the waiting page$/) do
  @waiting_page = Pages::Internal::Manage::Waiting.new
  url_regex = %r{^https://([a-z.-]+)/waiting/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$}
  expect(@waiting_page.current_url).to match(url_regex)
  expect(@waiting_page.h1_heading).to have_text("Send returns invitations")
  # rubocop:disable Layout/LineLength
  expected_message = "Please wait while the mailing list is assembled. This may take a few minutes. The letters will not be sent yet."
  # rubocop:enable Layout/LineLength
  expect(@waiting_page.waiting_page_message).to have_text(expected_message)
end

Then(/^I can confirm sending the returns invitations$/) do
  @send_returns_invitations = Pages::Internal::Manage::SendReturnsInvitations.new
  @send_returns_invitations.wait_until_mailing_list_message_visible
  url_regex = %r{^https:\/\/([a-z.-]+)\/batch-notifications\/review\/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$}
  expect(@send_returns_invitations.current_url).to match(url_regex)
  expect(@send_returns_invitations.h1_heading).to have_text("Send returns invitations")
  expect(@send_returns_invitations.mailing_list_message).to have_text("Mailing list is ready to send.")
  expect(@send_returns_invitations.csv_download_link).to have_text("Download recipients as a CSV file.")
  @send_returns_invitations.send_letters
end

Then(/^I can see the returns invitations success page$/) do
  @returns_invitations_success = Pages::Internal::Manage::ReturnsInvitationsSuccess.new
  expect(@returns_invitations_success.confirmation_message_title).to have_text("Return invitations sent")
  reference_number_regex = /^Your reference number(\r\n|\n|\r)\w{4}-\w{6}$/
  expect(@returns_invitations_success.confirmation_message_body.text).to match(reference_number_regex)
  expect(@returns_invitations_success.view_report_link).to have_text("View report")
end
