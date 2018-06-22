
Given(/^I am a new user$/) do
  # No action required
end

Given(/^I register my email address on the service$/) do
  @environment = Quke::Quke.config.custom["current_environment"].to_s
  @front_app = FrontOfficeApp.new
  @front_app.sign_in_page.load
  @front_app.sign_in_page.create_account_link.click
  @front_app.register_create_account_page.create_account_button.click
  @reg_email = @front_app.register_email_page.generate_email.to_s
  @front_app.register_email_page.submit(email_address: @reg_email)
  puts "Random email is: " + @reg_email
end

Given(/^I receive an email with sign in details$/) do
  @environment = Quke::Quke.config.custom["current_environment"].to_s
  # rubocop:disable Metrics/LineLength
  @email_api_url = ((Quke::Quke.config.custom["urls"][@environment]["root_url"]) + "/notifications/last?email=" + @reg_email).to_s
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
    password: Quke::Quke.config.custom["data"][@environment]["accounts"]["external_user"]["password"],
    confirmpw: Quke::Quke.config.custom["data"][@environment]["accounts"]["external_user"]["password"]
  )
end

Given(/^I can sign in with my new email address$/) do
  @environment = Quke::Quke.config.custom["current_environment"].to_s
  @front_app = FrontOfficeApp.new
  @front_app.sign_in_page.load
  @front_app.sign_in_page.submit(
    email: @reg_email.to_s,
    password: Quke::Quke.config.custom["data"][@environment]["accounts"]["external_user"]["password"]
  )
  Quke::Quke.config.custom["data"][@environment]["accounts"]["external_user"]["password"]
end

Then(/^I am on the add licences page$/) do
  expect(@front_app.register_add_licences_page.current_url).to include "/add-licences"
  expect(@front_app.register_add_licences_page.heading).to have_text("Which licences do you want to be able to view?")
end

When(/^I register a licence$/) do
  @environment = Quke::Quke.config.custom["current_environment"].to_s
  @licence_reg = Quke::Quke.config.custom["data"][@environment]["licence_reg"].to_s
  @licence_multi = Quke::Quke.config.custom["data"][@environment]["licence_multi"].to_s
  @front_app.register_add_licences_page.wait_for_licence_box
  @front_app.register_add_licences_page.submit(
    licence_box: @licence_multi
  )
  @front_app.register_confirm_licences_page.wait_for_continue_button
  @front_app.register_confirm_licences_page.submit
  @front_app.register_choose_address_page.wait_for_continue_button
  @front_app.register_choose_address_page.submit
end

When(/^I receive a confirmation code$/) do
  # This will only show in Dev, not in QA.  Writing another step below.
  @security_code = @front_app.register_sending_letter_page.security_code.text
  puts "Confirmation code is: " + @security_code
end

When(/^an admin user can read the code$/) do
  # Log in as admin user
  @front_app = FrontOfficeApp.new
  @environment = Quke::Quke.config.custom["current_environment"].to_s
  @front_app.sign_in_page.load
  @front_app.sign_in_page.submit(
    email: Quke::Quke.config.custom["data"][@environment]["accounts"]["internal_user"]["username"],
    password: Quke::Quke.config.custom["data"][@environment]["accounts"]["internal_user"]["password"]
  )
  @licence_reg = Quke::Quke.config.custom["data"][@environment]["licence_reg"].to_s
  @front_app.licences_page.search(
    search_form: @licence_reg.to_s
  )
  @front_app.licences_page.submit(licence: @licence_reg)
  expect(@front_app.licence_details_page.licence_2nd_heading).to have_text(@licence_reg)
  @security_code = @front_app.licence_details_page.confirmation_first_code.text
  puts "Confirmation code is: " + @security_code + "."
  @front_app.licence_details_page.sign_out_link.click
end

When(/^I am on the confirmation code page$/) do
  @environment = Quke::Quke.config.custom["current_environment"].to_s
  @front_app = FrontOfficeApp.new
  @front_app.sign_in_page.load
  @front_app.sign_in_page.submit(
    email: @reg_email.to_s,
    password: Quke::Quke.config.custom["data"][@environment]["accounts"]["external_user"]["password"]
  )
  Quke::Quke.config.custom["data"][@environment]["accounts"]["external_user"]["password"]
  expect(@front_app.register_security_code_page.current_url).to include "/security-code"
end

When(/^I enter my confirmation code$/) do
  @front_app.register_security_code_page.submit(
    security_code_box: @security_code
  )
end

When(/^I can select the licence I registered$/) do
  @front_app.licences_page.submit(licence: @licence_reg)
  expect(@front_app.licence_details_page.licence_2nd_heading).to have_text(@licence_reg)
end
