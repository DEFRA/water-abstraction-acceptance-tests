
Given(/^I add an agent to view my licences$/) do
  expect(@front_app.licences_page.navbar).to have_text("Manage your licences")
  @front_app.licences_page.manage_licences_link.click
  expect(@front_app.manage_licences_page.heading).to have_text("Manage your licences")

  @front_app.manage_licences_page.add_user_button.click
  @front_app.manage_give_access_page.add_user_button.click
  expect(@front_app.manage_give_access_page.heading).to have_text("Give access to view your licences")
  @front_app.agent_email = @front_app.manage_give_access_page.generate_email.to_s
  @front_app.manage_give_access_page.submit(email_address: @front_app.agent_email)
  puts "Agent's email address is: " + @front_app.agent_email
end

Given(/^the agent can log in and view the licences I registered$/) do
  expect(@front_app.manage_give_access_page.heading).to have_text("Access email sent to")

  @environment = Quke::Quke.config.custom["environment"].to_s
  # rubocop:disable Metrics/LineLength
  @email_api_url = ((Quke::Quke.config.custom["urls"][@environment]["root_url"]) + "/notifications/last?email=" + @front_app.agent_email).to_s
  # rubocop:enable Metrics/LineLength
  visit(@email_api_url)
  @email_json = @front_app.email_content_page.email_content.text

  # See register_steps.rb for comments on regex format
  @create_account_url = @email_json[/Go to our website: (.*?)\\r\\n2. Create/, 1].to_s
  visit(@create_account_url)

  @front_app.register_create_pw_page.submit(
    password: Quke::Quke.config.custom["data"]["accounts"]["password"],
    confirmpw: Quke::Quke.config.custom["data"]["accounts"]["password"]
  )

  @front_app.licences_page.submit(licence: @front_app.licence_reg)
  expect(@front_app.licence_details_page.heading).to have_text(@front_app.licence_reg)
  expect(@front_app.licence_details_page).to have_no_manage_licences_link

end

Given(/^I remove an agent to view my licences$/) do
  @front_app.licences_page.manage_licences_link.click
  @front_app.manage_licences_page.add_user_button.click
  expect(@front_app.manage_give_access_page.user_list).to have_text(@front_app.agent_email)
  @front_app.manage_give_access_page.remove_access_link.click
end

Given(/^the agent cannot view the licences I registered$/) do
  expect(@front_app.manage_access_removed_page.heading).to have_text("Access removed")
  expect(@front_app.manage_access_removed_page.content).to have_text(@front_app.agent_email)

  @front_app.manage_access_removed_page.sign_out_link.click
  @front_app.sign_in_page.load
  @front_app.sign_in_page.submit(
    email: @front_app.agent_email,
    password: Quke::Quke.config.custom["data"]["accounts"]["password"]
  )
  expect(@front_app.register_add_licences_page.heading).to have_text("Which licences do you want to view?")

end
