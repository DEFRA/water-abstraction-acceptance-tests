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


