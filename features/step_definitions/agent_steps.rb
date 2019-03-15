
Given(/^I add an agent to view my licences$/) do
  expect(production?).to be false
  expect(@front_app.licences_page.navbar).to have_text("Add licences or give access")
  @front_app.licences_page.nav_bar.manage_licences_link.click
  expect(@front_app.manage_licences_page.heading).to have_text("Add more of your licences or give others access")

  # Grant access to an agent with a random email address:
  @front_app.manage_licences_page.add_user_button.click
  @front_app.manage_give_access_page.add_user_button.click
  expect(@front_app.manage_give_access_page.heading).to have_text("Give access to your licences")
  @agent_email = @front_app.manage_give_access_page.generate_email.to_s
  @front_app.manage_give_access_page.submit(email_address: @agent_email)
  puts "Agent's email address is: " + @agent_email
  expect(@front_app.manage_give_access_page.heading).to have_text("Access email sent to")

  # Get the link for the agent to access the licences:
  @environment = Quke::Quke.config.custom["environment"].to_s
  # rubocop:disable Metrics/LineLength
  @email_api_url = ((Quke::Quke.config.custom["urls"][@environment]["root_url"]) + "/notifications/last?email=" + @agent_email).to_s
  # rubocop:enable Metrics/LineLength
  visit(@email_api_url)
  @email_json = @front_app.email_content_page.email_content.text

  # See register_steps.rb for comments on regex format
  @create_account_url = @email_json[/Go to our website: (.*?)\\r\\n2. Create/, 1].to_s

  # Go back to service and sign out for consistency between steps.
  visit(Quke::Quke.config.custom["urls"][@environment]["front_office"])
  find_link("Sign out").click
end

Given(/^I add the same agent to view my licences$/) do
  @front_app.licences_page.nav_bar.manage_licences_link.click
  @front_app.manage_licences_page.add_user_button.click
  @front_app.manage_give_access_page.add_user_button.click
  expect(@front_app.manage_give_access_page.heading).to have_text("Give access to your licences")
  # The next step generates another email to the agent, which is different from the first one.
  # The second email does not contain the URL that the agent needs to set their password.
  # The URL should already be stored in @create_account_url .
  @front_app.manage_give_access_page.submit(email_address: @agent_email)
  find_link("Sign out").click
end

Given(/^the agent can log in and view a licence I can access$/) do
  @licence_one = Quke::Quke.config.custom["data"]["licence_one"].to_s
  visit(@create_account_url)

  @front_app.register_create_pw_page.submit(
    password: Quke::Quke.config.custom["data"]["accounts"]["password"],
    confirmpw: Quke::Quke.config.custom["data"]["accounts"]["password"]
  )

  find_link(@licence_one).click
  expect(@front_app.licence_details_page.heading).to have_text(@licence_one)
  expect(@front_app.licence_details_page.nav_bar).to have_no_manage_licences_link
  find_link("Sign out").click # Can't use selector due to bug WATER-1905

end

Given(/^I revoke access to view my licences$/) do
  @front_app.licences_page.nav_bar.manage_licences_link.click
  @front_app.manage_licences_page.add_user_button.click
  expect(@front_app.manage_give_access_page.heading).to have_text("Give access to your licences")

  # While there's a Change link on screen, click the first one and remove user:
  while @front_app.manage_give_access_page.change_links.count.positive?

    # Click the first Change link:
    @front_app.manage_give_access_page.change_links.first.click
    @front_app.manage_change_access_page.remove_access_link.click
    expect(@front_app.manage_remove_access_page.heading).to have_text("You are about to remove access")
    @front_app.manage_remove_access_page.remove_access_button.click
    expect(@front_app.manage_access_removed_page.heading).to have_text("Access removed")

    # Now go back to the state at the start of the While loop:
    @front_app.manage_access_removed_page.nav_bar.manage_licences_link.click
    @front_app.manage_licences_page.add_user_button.click
    expect(@front_app.manage_give_access_page.heading).to have_text("Give access to your licences")
  end

  # Then sign out
  @front_app.manage_access_removed_page.govuk_banner.sign_out_link.click
end

Given(/^the agent cannot view any licences I own$/) do
  @front_app.sign_in_page.load
  @front_app.sign_in_page.submit(
    email: @agent_email,
    password: Quke::Quke.config.custom["data"]["accounts"]["password"]
  )
  expect(@front_app.register_add_licences_page.heading).to have_text("Add your licences to the service")
end

Given(/^the agent for multiple licences logs in$/) do
  visit(@create_account_url) # URL defined when the first agent grants access

  @front_app.register_create_pw_page.submit(
    password: Quke::Quke.config.custom["data"]["accounts"]["password"],
    confirmpw: Quke::Quke.config.custom["data"]["accounts"]["password"]
  )
end

Given(/^that agent can switch between those companies' licences$/) do
  # Ensure that licences have been registered for "external_user" and "external_user_2" within admin_tasks.featureend
  expect(@front_app.switch_company_page.heading).to have_text("Choose a licence holder")
  expect(@front_app.switch_company_page.company_radios.count.positive?).to eq(true)

  # Select first company
  @front_app.switch_company_page.company_1_radio.click
  @front_app.switch_company_page.continue_button.click
  expect(@front_app.licences_page.company_switcher).to have_text("You are managing")

  # Get text from the company switcher banner:
  switchertext1 = @front_app.licences_page.company_switcher.text
  @front_app.licences_page.change_company_link.click

  # Select second company
  @front_app.switch_company_page.company_2_radio.click
  @front_app.switch_company_page.continue_button.click
  expect(@front_app.licences_page.company_switcher).to have_text("You are managing")

  # Get text from the company switcher banner:
  switchertext2 = @front_app.licences_page.company_switcher.text

  # Sanity check that the companies have different names:
  expect(switchertext1 == switchertext2).to eq(false)
  find_link("Sign out").click

end
