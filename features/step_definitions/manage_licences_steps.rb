
Given(/^I can see the manage licences link$/) do
  expect(@front_app.licences_page.navbar).to have_text("Manage your licences")
end

Given(/^I go to the manage licences link$/) do
  @front_app.licences_page.manage_licences_link.click
end

Then(/^I am on the manage your licences page$/) do
  expect(@front_app.manage_licences_page.heading).to have_text("Manage your licences")
end

Given(/^I add an agent to view my licences$/) do
  @front_app.manage_licences_page.add_user_button.click
  @front_app.manage_give_access_page.add_user_button.click
  expect(@front_app.manage_give_access_page.heading).to have_text("Give access to view your licences")
  @agent_email = @front_app.manage_give_access_page.generate_email.to_s
  @front_app.manage_give_access_page.submit(email_address: @agent_email)
  puts "Agent's email address is: " + @agent_email
end

Given(/^I receive confirmation that the agent has received an email$/) do
  expect(@front_app.manage_give_access_page.heading).to have_text("Access email sent to")
end

Given(/^the agent can log in and view the licences I registered$/) do

  @environment = Quke::Quke.config.custom["current_environment"].to_s
  # rubocop:disable Metrics/LineLength
  @email_api_url = ((Quke::Quke.config.custom["urls"][@environment]["root_url"]) + "/notifications/last?email=" + @agent_email).to_s
  # rubocop:enable Metrics/LineLength
  visit(@email_api_url)
  @email_json = @front_app.email_content_page.email_content.text

  # See register_steps.rb for comments on regex format
  @create_account_url = @email_json[/Go to our website: (.*?)\\r\\n2. Create/, 1].to_s
  visit(@create_account_url)

  @front_app.register_create_pw_page.submit(
    password: Quke::Quke.config.custom["data"][@environment]["accounts"]["external_user"]["password"],
    confirmpw: Quke::Quke.config.custom["data"][@environment]["accounts"]["external_user"]["password"]
  )

  @front_app.licences_page.submit(licence: @licence_reg)
  expect(@front_app.licence_details_page.licence_2nd_heading).to have_text(@licence_reg)
  expect(@front_app.licence_details_page).to have_no_manage_licences_link

end

Given(/^I remove an agent to view my licences$/) do
  @front_app.manage_licences_page.add_user_button.click
  expect(@front_app.manage_give_access_page.user_list).to have_text(@agent_email)
  @front_app.manage_give_access_page.remove_access_link.click
end

Given(/^I receive confirmation that the agent is removed$/) do
  expect(@front_app.manage_access_removed_page.heading).to have_text("Access removed")
  expect(@front_app.manage_access_removed_page.content).to have_text(@agent_email)
end

Given(/^the agent cannot view the licences I registered$/) do
  @front_app.manage_access_removed_page.sign_out_link.click
  @front_app.sign_in_page.load
  @front_app.sign_in_page.submit(
    email: @agent_email,
    password: Quke::Quke.config.custom["data"][@environment]["accounts"]["external_user"]["password"]
  )
  expect(@front_app.register_add_licences_page.heading).to have_text("Which licences do you want to be able to view?")

end
