
Given(/^I am a new user$/) do
  # No action required
end

Given(/^I register my email address on the service$/) do
  @environment = Quke::Quke.config.custom["current_environment"].to_s
  @front_app = FrontOfficeApp.new
  @front_app.start_page.load
  @front_app.start_page.createaccount
  @reg_email = @front_app.register_email_page.generate_email.to_s
  @front_app.register_email_page.submit(email_address: @reg_email)
  puts "Random email is: " + @reg_email
end

Given(/^I receive an email with sign in details$/) do
  @front_app.mailinator_home_page.load
  @front_app.mailinator_home_page.submit(inbox: @reg_email)
  @front_app.mailinator_inbox_page.email[0].from.click

  @front_app.mailinator_inbox_page.email_details do |frame|
    @new_window = window_opened_by { frame.create_password.click }
  end

  within_window @new_window do
    @front_app.register_create_pw_page.submit(
      password: Quke::Quke.config.custom["accounts"]["water_user2"]["password"],
      confirmpw: Quke::Quke.config.custom["accounts"]["water_user2"]["password"]
    )
  end
end

Given(/^I can sign in with my new email address$/) do
  @front_app = FrontOfficeApp.new
  @front_app.start_page.load
  @front_app.start_page.submit
  @front_app.sign_in_page.submit(
    email: @reg_email.to_s,
    password: Quke::Quke.config.custom["accounts"]["water_user2"]["password"]
  )
  Quke::Quke.config.custom["accounts"]["water_user2"]["password"]
end

Then(/^I am on the add licences page$/) do
  expect(@front_app.register_add_licences_page.current_url).to include "/add-licences"
  expect(@front_app.register_add_licences_page.heading).to have_text("Which licences do you want to be able to view?")
end

When(/^I register a licence$/) do
  @licence_reg = Quke::Quke.config.custom["data"][@environment]["licence_reg"]
  @front_app.register_add_licences_page.submit(
    licence_box: @licence_reg
  )
  @front_app.register_confirm_licences_page.submit
  @front_app.register_choose_address_page.submit
end

When(/^I receive a confirmation code$/) do
  @security_code = @front_app.register_sending_letter_page.security_code.text
  puts "Confirmation code is: " + @security_code
end

When(/^I am on the confirmation code page$/) do
  expect(@front_app.register_security_code_page.current_url).to include "/security-code"
end

When(/^I enter my confirmation code$/) do
  @front_app.register_security_code_page.submit(
    security_code_box: @security_code
  )
end

When(/^I can select the licence I registered$/) do
  @front_app.licences_page.submit(licence: @licence_reg)
  expect(@front_app.licence_details_page.licence_breadcrumb).to have_text(@licence_reg)
end
