
Given(/^I am a new user$/) do
  # No action required
end

Given(/^I register my email address on the service$/) do
  @environment = Quke::Quke.config.custom["environment"].to_s
  # Failsafe to stop test in production
  expect(2 + 2).to eq(5) if @environment == "prod"
  @front_app = FrontOfficeApp.new
  @front_app.sign_in_page.load
  @front_app.sign_in_page.create_account_link.click
  @front_app.register_create_account_page.create_account_button.click
  # Variables such as the following are initialised in front_office_app.rb
  @front_app.reg_email = @front_app.register_email_page.generate_email.to_s
  @front_app.register_email_page.submit(email_address: @front_app.reg_email)
  puts "Random email is: " + @front_app.reg_email
end

Given(/^I receive an email with sign in details$/) do
  @environment = Quke::Quke.config.custom["environment"].to_s
  # rubocop:disable Metrics/LineLength
  @email_api_url = ((Quke::Quke.config.custom["urls"][@environment]["root_url"]) + "/notifications/last?email=" + @front_app.reg_email).to_s
  # rubocop:enable Metrics/LineLength
  visit(@email_api_url)
  @email_json = @front_app.email_content_page.email_content.text

  # Finds the text in the API JSON between the following two strings:
  # account: \r\n\r\n#
  # \r\n\r\nIf
  # Regex format used: Find all text between the first instance of 001 and 002
  # @create_account_url = @email_json[/001(.*?)002/,1].to_s
  # See https://stackoverflow.com/questions/4218986/ruby-using-regex-to-find-something-in-between-two-strings
  @create_account_url = @email_json[/account: \\r\\n\\r\\n#(.*?)\\r\\n\\r\\nIf/, 1].to_s
  visit(@create_account_url)

  @front_app.register_create_pw_page.submit(
    password: Quke::Quke.config.custom["data"]["accounts"]["password"],
    confirmpw: Quke::Quke.config.custom["data"]["accounts"]["password"]
  )
end

Given(/^I sign in with my new email address$/) do

  @front_app.sign_in_page.load
  @front_app.sign_in_page.submit(
    email: @front_app.reg_email.to_s,
    password: Quke::Quke.config.custom["data"]["accounts"]["password"]
  )
end

Then(/^I am on the add licences page$/) do
  expect(@front_app.register_add_licences_page.current_url).to include "/add-licences"
  expect(@front_app.register_add_licences_page.heading).to have_text("Which licences do you want to view?")
end

When(/^I register a licence$/) do
  @front_app.licence_reg = Quke::Quke.config.custom["data"]["licence_reg"].to_s
  @licence_multi = Quke::Quke.config.custom["data"]["licence_some"].to_s
  @front_app.register_add_licences_page.wait_for_licence_box
  @front_app.register_add_licences_page.submit(
    licence_box: @licence_multi
  )
  @front_app.register_confirm_licences_page.wait_for_continue_button
  @front_app.register_confirm_licences_page.submit
  @front_app.register_choose_address_page.wait_for_continue_button
  @front_app.register_choose_address_page.submit
end

When(/^an admin user can read the code$/) do
  # Log in as admin user
  @environment = Quke::Quke.config.custom["environment"].to_s
  @front_app.sign_in_page.load
  @front_app.sign_in_page.submit(
    email: Quke::Quke.config.custom["data"]["accounts"]["internal_user"],
    password: Quke::Quke.config.custom["data"]["accounts"]["password"]
  )
  @front_app.licence_reg = Quke::Quke.config.custom["data"]["licence_reg"].to_s
  @front_app.licences_page.search(
    search_form: @front_app.licence_reg.to_s
  )
  @front_app.licences_page.submit(licence: @front_app.licence_reg)
  expect(@front_app.licence_details_page.heading).to have_text(@front_app.licence_reg)
  @security_code = @front_app.licence_details_page.confirmation_first_code.text
  puts "Confirmation code is: " + @security_code + "."
  @front_app.licence_details_page.sign_out_link.click
end

When(/^I enter my confirmation code$/) do
  @environment = Quke::Quke.config.custom["environment"].to_s
  @front_app.sign_in_page.load
  @front_app.sign_in_page.submit(
    email: @front_app.reg_email.to_s,
    password: Quke::Quke.config.custom["data"]["accounts"]["password"]
  )
  expect(@front_app.register_security_code_page.current_url).to include "/security-code"
  @front_app.register_security_code_page.submit(
    security_code_box: @security_code
  )
end

When(/^I select a licence I registered$/) do
  @front_app.licences_page.submit(licence: @front_app.licence_reg)
  expect(@front_app.licence_details_page.heading).to have_text(@front_app.licence_reg)
  # Get the start year for the version, for returns tests.
  # rubocop:disable Metrics/LineLength
  @version_years = @front_app.licence_details_page.licence_date_info.text.scan(/[[:digit:]][[:digit:]][[:digit:]][[:digit:]]/)
  # rubocop:enable Metrics/LineLength
  @earliest_version_year = @version_years.min.to_i
end
