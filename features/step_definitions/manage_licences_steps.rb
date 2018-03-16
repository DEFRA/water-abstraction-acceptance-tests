
Given(/^I can see the manage licences link$/) do
  expect(@front_app.licences_page.banner_links).to have_text("Manage your licences")
end

Given(/^I go to the manage licences link$/) do
  @front_app.licences_page.manage_licences_link.click
end

Then(/^I am on the manage your licences page$/) do
  expect(@front_app.manage_licences_page.heading).to have_text("Manage your licences")
end

Given(/^I add an agent to view my licences$/) do
  @front_app.manage_licences_page.add_user_button.click
  expect(@front_app.manage_give_access_page.heading).to have_text("Give access to view your licences")
  @geoff_email = @front_app.manage_give_access_page.generate_email.to_s
  @front_app.manage_give_access_page.submit(email_address: @geoff_email)
  puts "Agent's email address is: " + @geoff_email
end

Given(/^I receive confirmation that the agent has received an email$/) do
  expect(@front_app.manage_give_access_page.heading).to have_text("Access email sent to")
end

Given(/^the agent can log in and view the licences I registered$/) do
  @environment = Quke::Quke.config.custom["current_environment"].to_s
  @front_app.mailinator_home_page.load
  @front_app.mailinator_home_page.wait_for_inbox
  @front_app.mailinator_home_page.submit(inbox: @geoff_email)
  @front_app.mailinator_inbox_page.wait_for_email
  @front_app.mailinator_inbox_page.email[0].from.click

  @front_app.mailinator_inbox_page.email_details do |frame|
    @new_window = window_opened_by { frame.create_password.click }
  end

  within_window @new_window do
    @front_app.register_create_pw_page.submit(
      password: Quke::Quke.config.custom["data"][@environment]["accounts"]["water_user2"]["password"],
      confirmpw: Quke::Quke.config.custom["data"][@environment]["accounts"]["water_user2"]["password"]
    )
    @front_app.licences_page.submit(licence: @licence_reg)
    expect(@front_app.licence_details_page.licence_breadcrumb).to have_text(@licence_reg)
    expect(@front_app.licence_details_page).to have_no_manage_licences_link
  end

end
