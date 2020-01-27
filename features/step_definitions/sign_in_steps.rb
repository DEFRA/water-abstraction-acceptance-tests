Given(/^I am on the sign in page$/) do
  @front_app = FrontOfficeApp.new
  @front_app.sign_in_page.load
end

Given(/^I am on the sign in page for "([^"]*)"$/) do |account|
  @user_type = account
  @front_app = FrontOfficeApp.new
  @front_app.sign_in_page.load

  back_office_internal_url = internal_url(:sign_in)
  @url = back_office_internal_url if @user_type == "internal_user" || @user_type == "ar_user"
  puts "user type: #{@user_type} url: #{@url}"
  visit(@url) if @user_type == "internal_user" || @user_type == "ar_user"
end

Given(/^I sign into my account as "([^"]*)"$/) do |account|
  # If in prod, switch to internal user because an external user won't work:
  account = "internal_user" if production? == true
  # Record the user type for different tests
  @user_type = account.to_s
  @front_app.sign_in_page.submit(
    email: config_accounts(account),
    password: config_accounts("password")
  )
end

When(/^I enter my password incorrectly$/) do
  @front_app.sign_in_page.submit(
    email: config_accounts("external_user"),
    password: "@3kjldjfa@"
  )
end

When(/^I enter blank details$/) do
  @front_app.sign_in_page.submit(email: "", password: "")
end

Then(/^I am informed "([^"]*)"$/) do |message|
  expect(@front_app.sign_in_page).to have_text(message)
end

Given(/^I lock my account by attempting to sign in with an incorrect password "([^"]*)" times$/) do |attempts|
  @environment = config_environment
  sign_in_page = @front_app.sign_in_page

  if @environment != "preprod" && @environment != "prod"
    # Locks account after ten unsuccessful attempts
    @account_to_lock = config_accounts("external_user")
    password = config_accounts("password")

    sign_in_page.lock_account(email: @account_to_lock, limit: attempts.to_i)

    sign_in_page.submit_credentials(@account_to_lock, password)
    expect(sign_in_page.error_heading).to have_text("Check your email address\nCheck your password")
  end
end

Given(/^I enter a correct password between incorrect attempts$/) do
  external_user_email = config_accounts("external_user")
  password = config_accounts("password")

  # Locks account after ten unsuccessful attempts
  @account_to_lock = external_user_email
  @front_app.sign_in_page.lock_account(
    email: @account_to_lock,
    limit: 9
  )

  @front_app.sign_in_page.submit_credentials(external_user_email, password)

  @front_app.register_add_licences_page.govuk_banner.sign_out_link.click

  find_link("Sign in").click
  @front_app.sign_in_page.wait_until_email_visible

  @front_app.sign_in_page.lock_account(
    email: @account_to_lock,
    limit: 9
  )

  @front_app.sign_in_page.submit_credentials(external_user_email, password)
end

When(/^I unlock my account using the email link provided$/) do
  # Use email API.  Copy step syntax from register_steps.rb
  @environment = config_environment
  if @environment != "preprod" && @environment != "prod"
    sign_in_page = SignInPage.new
    register_create_pw_page = RegisterCreatePasswordPage.new
    email_content_page = EmailContentPage.new

    internal_user_email = config_accounts("internal_user")
    password = config_accounts("password")

    sign_in_page.submit_password(internal_user_email, password)
    # rubocop:disable Metrics/LineLength
    @email_api_url = ((Quke::Quke.config.custom["urls"][@environment]["root_url"]) + "notifications/last?email=" + @account_to_lock).to_s
    # rubocop:enable Metrics/LineLength
    visit(@email_api_url)
    @email_json = email_content_page.email_content.text

    # Find text between: once:\r\n\r\n#
    # and: \r\n\r\n^ If
    @unlock_account_url = @email_json[/once:\\r\\n\\r\\n#(.*?)\\r\\n\\r\\n\^ If/, 1].to_s
    visit(@unlock_account_url)

    register_create_pw_page.submit_password(password)
  end
end

When(/^I sign out$/) do
  find_link("Sign out").click
end
