
Given(/^I am on the sign in page$/) do
  @front_app = FrontOfficeApp.new
  @front_app.sign_in_page.load
end

Given(/^I sign into my account as "([^"]*)"$/) do |account|
  expect(production?).to be false
  @environment = Quke::Quke.config.custom["environment"].to_s
  # Record the user type for different tests
  @user_type = account.to_s
  @front_app.sign_in_page.load
  @front_app.sign_in_page.submit(
    email: Quke::Quke.config.custom["data"]["accounts"][account.to_s],
    password: Quke::Quke.config.custom["data"]["accounts"]["password"]
  )
end

When(/^I enter my password incorrectly$/) do
  @front_app.sign_in_page.submit(
    email: Quke::Quke.config.custom["data"]["accounts"]["external_user"],
    password: "@3kjldjfa@"
  )
end

When(/^I enter blank details$/) do
  @front_app.sign_in_page.submit(
    email: "",
    password: ""
  )
end

Then(/^I am informed "([^"]*)"$/) do |message|
  expect(@front_app.sign_in_page).to have_text(message)
end

Given(/^I lock my account by attempting to sign in with an incorrect password "([^"]*)" times$/) do |attempts|
  @environment = Quke::Quke.config.custom["environment"].to_s
  if @environment != "preprod" && @environment != "prod"
    # Locks account after ten unsuccessful attempts
    @account_to_lock = Quke::Quke.config.custom["data"]["accounts"]["external_user"]
    @front_app.sign_in_page.lock_account(
      email: @account_to_lock,
      limit: attempts.to_i
    )
    @front_app.sign_in_page.submit(
      email: Quke::Quke.config.custom["data"]["accounts"]["external_user"],
      password: Quke::Quke.config.custom["data"]["accounts"]["password"]
    )
    expect(@front_app.sign_in_page.error_heading).to have_text("Your email address or password is incorrect")
  end
end

Given(/^I enter a correct password between incorrect attempts$/) do
  # Locks account after ten unsuccessful attempts
  @account_to_lock = Quke::Quke.config.custom["data"]["accounts"]["external_user"]
  @front_app.sign_in_page.lock_account(
    email: @account_to_lock,
    limit: 9
  )
  @front_app.sign_in_page.submit(
    email: Quke::Quke.config.custom["data"]["accounts"]["external_user"],
    password: Quke::Quke.config.custom["data"]["accounts"]["password"]
  )
  @front_app.register_add_licences_page.govuk_banner.sign_out_link.click
  @front_app.sign_out_page.sign_in_link.click
  @account_to_lock = Quke::Quke.config.custom["data"]["accounts"]["external_user"]
  @front_app.sign_in_page.lock_account(
    email: @account_to_lock,
    limit: 9
  )
  @front_app.sign_in_page.submit(
    email: Quke::Quke.config.custom["data"]["accounts"]["external_user"],
    password: Quke::Quke.config.custom["data"]["accounts"]["password"]
  )
end

When(/^I unlock my account using the email link provided$/) do
  # Use email API.  Copy step syntax from register_steps.rb
  @environment = Quke::Quke.config.custom["environment"].to_s
  if @environment != "preprod" && @environment != "prod"
    @front_app.sign_in_page.submit(
      email: Quke::Quke.config.custom["data"]["accounts"]["internal_user"],
      password: Quke::Quke.config.custom["data"]["accounts"]["password"]
    )
    # rubocop:disable Metrics/LineLength
    @email_api_url = ((Quke::Quke.config.custom["urls"][@environment]["root_url"]) + "/notifications/last?email=" + @account_to_lock).to_s
    # rubocop:enable Metrics/LineLength
    visit(@email_api_url)
    @email_json = @front_app.email_content_page.email_content.text

    # Find text between: once:\r\n\r\n#
    # and: \r\n\r\n^ If
    @unlock_account_url = @email_json[/once:\\r\\n\\r\\n#(.*?)\\r\\n\\r\\n\^ If/, 1].to_s
    visit(@unlock_account_url)

    @front_app.register_create_pw_page.submit(
      password: Quke::Quke.config.custom["data"]["accounts"]["password"],
      confirmpw: Quke::Quke.config.custom["data"]["accounts"]["password"]
    )
  end
end
