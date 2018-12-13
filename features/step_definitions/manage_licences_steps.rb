
Given(/^I add an agent to view my licences$/) do
  expect(@front_app.licences_page.navbar).to have_text("Add licences or give access")
  @front_app.licences_page.nav_bar.manage_licences_link.click
  expect(@front_app.manage_licences_page.heading).to have_text("Add more of your licences or give others access")

  @front_app.manage_licences_page.add_user_button.click
  @front_app.manage_give_access_page.add_user_button.click
  expect(@front_app.manage_give_access_page.heading).to have_text("Give access to your licences")
  @agent_email = @front_app.manage_give_access_page.generate_email.to_s
  @front_app.manage_give_access_page.submit(email_address: @agent_email)
  puts "Agent's email address is: " + @agent_email
end

Given(/^the agent can log in and view a licence I can access$/) do
  expect(@front_app.manage_give_access_page.heading).to have_text("Access email sent to")
  @environment = Quke::Quke.config.custom["environment"].to_s
  @licence_one = Quke::Quke.config.custom["data"]["licence_one"].to_s
  # rubocop:disable Metrics/LineLength
  @email_api_url = ((Quke::Quke.config.custom["urls"][@environment]["root_url"]) + "/notifications/last?email=" + @agent_email).to_s
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

  find_link(@licence_one).click
  expect(@front_app.licence_details_page.heading).to have_text(@licence_one)
  expect(@front_app.licence_details_page.nav_bar).to have_no_manage_licences_link

end

Given(/^I remove an agent to view my licences$/) do
  @front_app.licences_page.nav_bar.manage_licences_link.click
  @front_app.manage_licences_page.add_user_button.click
  expect(@front_app.manage_give_access_page.user_list).to have_text(@agent_email)
  @front_app.manage_give_access_page.remove_access_link.click
  @front_app.manage_change_access_page.remove_access_link.click
  expect(@front_app.manage_remove_access_page.heading).to have_text("You are about to remove access")
  expect(@front_app.manage_remove_access_page.content).to have_text(@agent_email)
  @front_app.manage_remove_access_page.remove_access_button.click
end

Given(/^the agent cannot view any licences I own$/) do
  expect(@front_app.manage_access_removed_page.heading).to have_text("Access removed")
  expect(@front_app.manage_access_removed_page.content).to have_text(@agent_email)

  @front_app.manage_access_removed_page.govuk_banner.sign_out_link.click
  @front_app.sign_in_page.load
  @front_app.sign_in_page.submit(
    email: @agent_email,
    password: Quke::Quke.config.custom["data"]["accounts"]["password"]
  )
  expect(@front_app.register_add_licences_page.heading).to have_text("Add your licences to the service")

end
