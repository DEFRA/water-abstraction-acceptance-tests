Given(/^I navigate to the "([^"]*)" page$/) do |page|
  if page.eql? "paper forms"
    @page.click_paper_forms
    @paper_forms_page = Pages::Internal::Manage::SendPaperForms.new
    expect(@paper_forms_page.current_url).to include("/returns-notifications/forms")
  elsif page.eql? "returns invitations"
    @page.click_invitations
    @returns_invitations_page = Pages::Internal::Manage::ReturnsInvitations.new
    expect(@returns_invitations_page.current_url).to include("/returns-notifications/invitations")
  end
end

Then(/^I can't see the "([^"]*)" link$/) do |notification_type|
  link_text = {
    "paper forms" => "Paper forms",
    "returns invitations" => "Invitations"
  }
  page = Pages::Internal::ManagePage.new
  expect(page).to have_no_text(link_text[notification_type])
end
