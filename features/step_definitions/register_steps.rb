
Given(/^I have no registered licences for "([^"]*)"$/) do |tasktype|
  expect(production?).to be false

  # Unlink licences
  @environment = Quke::Quke.config.custom["environment"].to_s

  @back_app = BackOfficeApp.new
  @back_login = Quke::Quke.config.custom["urls"][@environment]["back_office_login"].to_s
  @back_root = Quke::Quke.config.custom["urls"][@environment]["back_office_root"].to_s
  # Get the document IDs for each licence to be unlinked as a single array:
  @unlink_ids = if tasktype == "registration"
                  Quke::Quke.config.custom["data"]["licence_reg_unlink"][@environment]
                elsif tasktype == "returns"
                  Quke::Quke.config.custom["data"]["licence_returns_unlink"][@environment]
                else
                  Quke::Quke.config.custom["data"]["licence_some_unlink"][@environment]
                end
  visit(@back_login)
  # Unlink each licence by visiting the URL generated from each document ID:
  @unlink_ids.each { |id| visit(@back_root + "crm/document/" + id.to_s + "/unlink") }
end

Given(/^I register my email address on the service$/) do
  @environment = Quke::Quke.config.custom["environment"].to_s
  @front_app = FrontOfficeApp.new
  @front_app.sign_in_page.load
  @front_app.sign_in_page.create_account_link.click
  @front_app.register_create_account_page.create_account_button.click
  # Variables such as the following are initialised in front_office_app.rb
  @reg_email = @front_app.register_email_page.generate_email.to_s
  @front_app.register_email_page.submit(email_address: @reg_email)
  puts "Random email is: " + @reg_email
end

Given(/^I receive an email with sign in details$/) do
  @environment = Quke::Quke.config.custom["environment"].to_s
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
    password: Quke::Quke.config.custom["data"]["accounts"]["password"],
    confirmpw: Quke::Quke.config.custom["data"]["accounts"]["password"]
  )
end

Given(/^I sign in with my new email address$/) do
  @front_app.sign_in_page.load
  @front_app.sign_in_page.submit(
    email: @reg_email.to_s,
    password: Quke::Quke.config.custom["data"]["accounts"]["password"]
  )
end

Then(/^I am on the add licences page$/) do
  expect(@front_app.register_add_licences_page.current_url).to include "/add-licences"
  expect(@front_app.register_add_licences_page.heading).to have_text("Add your licences to the service")
end

When(/^I register a licence for "([^"]*)"$/) do |tasktype|
  @licence_reg = if tasktype == "registration"
                   Quke::Quke.config.custom["data"]["licence_reg_one"].to_s
                 elsif tasktype == "returns"
                   Quke::Quke.config.custom["data"]["licence_returns"].to_s
                 else # refresh the data
                   Quke::Quke.config.custom["data"]["licence_one"].to_s
                 end
  @licence_multi = if tasktype == "registration"
                     Quke::Quke.config.custom["data"]["licence_reg_some"].to_s
                   elsif tasktype == "returns"
                     Quke::Quke.config.custom["data"]["licence_returns"].to_s
                   else
                     Quke::Quke.config.custom["data"]["licence_some"].to_s
                   end
  @front_app.register_add_licences_page.wait_for_licence_box
  @front_app.register_add_licences_page.submit(
    licence_box: @licence_multi
  )
  @front_app.register_confirm_licences_page.wait_for_continue_button
  @front_app.register_confirm_licences_page.continue_button.click
  @front_app.register_choose_address_page.wait_for_continue_button
  @front_app.register_choose_address_page.address_radio.click
  @front_app.register_choose_address_page.continue_button.click
end

When(/^an admin user can read the code$/) do
  # Log in as admin user
  @environment = Quke::Quke.config.custom["environment"].to_s
  @front_app.sign_in_page.load
  @front_app.sign_in_page.submit(
    email: Quke::Quke.config.custom["data"]["accounts"]["internal_user"],
    password: Quke::Quke.config.custom["data"]["accounts"]["password"]
  )
  @front_app.licences_page.search(
    search_form: @licence_reg.to_s
  )
  find_link(@licence_reg).click
  expect(@front_app.licence_details_page.heading).to have_text(@licence_reg)
  @security_code = @front_app.licence_details_page.confirmation_first_code.text
  puts "Confirmation code is: " + @security_code + "."
  @front_app.licence_details_page.govuk_banner.sign_out_link.click
end

When(/^I enter my confirmation code$/) do
  expect(@front_app.register_security_code_page.current_url).to include "/security-code"
  @front_app.register_security_code_page.submit(
    security_code_box: @security_code
  )
end

When(/^I select a licence I registered$/) do
  find_link(@licence_reg).click
  expect(@front_app.licence_details_page.heading).to have_text(@licence_reg)
end
