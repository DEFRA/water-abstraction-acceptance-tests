Given(/^I have no registered licences for "([^"]*)"$/) do |tasktype|
  expect(production?).to be false

  # Unlink licences - this means that this feature can be run standalone.
  @environment = config_environment

  @back_app = BackOfficeApp.new
  @back_login = Quke::Quke.config.custom["urls"][@environment]["back_office_login"].to_s
  @back_root = Quke::Quke.config.custom["urls"][@environment]["back_office_root"].to_s
  # Get the document IDs for each licence to be unlinked as a single array:
  @unlink_ids = if tasktype == "registration"
                  Quke::Quke.config.custom["data"]["licence_reg_unlink"][@environment]
                elsif tasktype == "returns"
                  Quke::Quke.config.custom["data"]["licence_returns_unlink"][@environment]
                elsif tasktype == "switching companies"
                  Quke::Quke.config.custom["data"]["licence_company2_unlink"][@environment]
                else
                  Quke::Quke.config.custom["data"]["licence_some_unlink"][@environment]
                end
  visit(@back_login)
  # Unlink each licence by visiting the URL generated from each document ID:
  @unlink_ids.each { |id| visit(@back_root + "crm/document/" + id.to_s + "/unlink") }
  page.execute_script "window.close();"
end

Given(/^I register my email address on the service$/) do

  @environment = config_environment

  # Create an account using a random email address
  @front_app = FrontOfficeApp.new
  @front_app.sign_in_page.load
  @front_app.sign_in_page.create_account_link.click
  @front_app.register_create_account_page.create_account_button.click

  # Store the email used for registration and output on screen (useful for debugging):
  @reg_email = @front_app.register_email_page.generate_email.to_s
  @front_app.register_email_page.submit(email_address: @reg_email)
  puts "Random email is: " + @reg_email

  # Also test the "not received email screen":
  @front_app.register_email_page.not_received_email_link.click
  expect(@front_app.register_email_page.heading).to have_text("Ask for another email")
  @front_app.register_email_page.submit(email_address: @reg_email)

  # Now read the contents of the last email sent to the random email address that was just generated.
  # The contents are displayed via an API that was created specifically for the automated tests.
  email_api_url = "#{external_url(:root)}notifications/last?email=#{@reg_email}"

  puts email_api_url
  visit email_api_url
  email_json = @front_app.email_content_page.email_content.text

  # Finds the text in the API JSON between the following two strings:
  # reset it here: (with trailing space)
  #  \r\n\r\nIf (with leading space)
  # Regex format used: Find all text between the first instance of 001 and 002
  # @create_account_url = email_json[/001(.*?)002/,1].to_s
  # See https://stackoverflow.com/questions/4218986/ruby-using-regex-to-find-something-in-between-two-strings
  # The link for the first email would be:
  # @create_account_url = email_json[/account: \\r\\n\\r\\n#(.*?)\\r\\n\\r\\nIf/, 1].to_s
  # Password reset link from the second email received:
  @create_account_url = email_json[/reset it here: (.*?) \\r\\n\\r\\nIf/, 1].to_s

  # Go to the URL that was in the email contents:
  visit @create_account_url

  password = config_accounts("password")
  @front_app.register_create_pw_page.submit(password: password, confirmpw: password)
end

Given(/^I sign in with my new email address$/) do
  @front_app.sign_in_page.load
  @front_app.sign_in_page.submit(
    email: @reg_email.to_s,
    password: config_accounts("password")
  )
end

Then(/^I am on the add licences page$/) do
  find_link("Add licences or give access").click
  expect(@front_app.register_add_licences_page.current_url).to include "/manage_licences"
  find_link("Add more of your licences to the service").click
  expect(@front_app.register_add_licences_page.current_url).to include "/add-licences"
  expect(@front_app.register_add_licences_page.heading).to have_text("Add your licences to the service")
end

When(/^I register a licence for "([^"]*)"$/) do |tasktype|
  # Register different licences based on the task type
  @tasktype = tasktype
  @licence_reg = if tasktype == "registration"
                   Quke::Quke.config.custom["data"]["licence_reg_one"].to_s
                 elsif tasktype == "returns"
                   Quke::Quke.config.custom["data"]["licence_returns"].to_s
                 elsif tasktype == "switching companies"
                   Quke::Quke.config.custom["data"]["licence_company2"].to_s
                 else # refresh the data
                   Quke::Quke.config.custom["data"]["licence_one"].to_s
                 end
  @licence_multi = if tasktype == "registration"
                     Quke::Quke.config.custom["data"]["licence_reg_some"].to_s
                   elsif tasktype == "returns"
                     Quke::Quke.config.custom["data"]["licence_returns"].to_s
                   elsif tasktype == "switching companies"
                     Quke::Quke.config.custom["data"]["licence_company2"].to_s
                   else
                     Quke::Quke.config.custom["data"]["licence_some"].to_s
                   end
  @front_app.register_add_licences_page.wait_until_licence_box_visible
  @front_app.register_add_licences_page.help_link.click
  expect(@front_app.register_add_licences_page.help_text).to have_text("Telephone: 03708 506 506")
  @front_app.register_add_licences_page.submit(
    licence_box: @licence_multi
  )
  # Check that the "not my licences" link works
  @front_app.register_confirm_licences_page.not_mine_link.click
  # rubocop:disable Metrics/LineLength
  expect(@front_app.register_confirm_licences_page.heading).to have_text("Sorry, we need to confirm your licence information with you")
  # rubocop:enable Metrics/LineLength
  page.go_back
  @front_app.register_confirm_licences_page.wait_until_continue_button_visible
  @front_app.register_confirm_licences_page.continue_button.click
  @front_app.register_choose_address_page.wait_until_continue_button_visible
  @front_app.register_choose_address_page.address_radio.click
  @front_app.register_choose_address_page.continue_button.click
  @front_app.register_choose_address_page.continue_button.click
  @front_app.register_sending_letter_page.sign_out_link.click
end

When(/^an admin user can get the last verification code for the last registered user$/) do
  @front_app.sign_in_page.load
  visit internal_url(:sign_in)

  @front_app.sign_in_page.submit(
    email: config_accounts("internal_user"),
    password: config_accounts("password")
  )

  # Search for the user
  @front_app.licences_page.search(
    search_input: @reg_email
  )

  find_link(@reg_email).click

  expect(@front_app.user_details_page.heading).to have_text(@reg_email)

  @security_code = @front_app.user_details_page.latest_verification_code
end

When(/^an admin user can get the last verification code for the "([^"]*)" user$/) do |user_type|
  user_email = config_accounts(user_type)

  @front_app.sign_in_page.load
  visit internal_url(:sign_in)

  @front_app.sign_in_page.submit(
    email: config_accounts("internal_user"),
    password: config_accounts("password")
  )

  # Search for the user
  @front_app.licences_page.search(
    search_input: user_email
  )

  find_link(user_email).click

  expect(@front_app.user_details_page.heading).to have_text(user_email)

  @security_code = @front_app.user_details_page.latest_verification_code
end

When(/^an admin user can read the code$/) do
  # Log in as admin user
  visit internal_url(:sign_in)

  @front_app.sign_in_page.submit(
    email: config_accounts("internal_user"),
    password: config_accounts("password")
  )

  # Search for the licence that was registered:
  @front_app.licences_page.search(
    search_input: @licence_reg.to_s
  )
  find_link(@licence_reg).click
  expect(@front_app.licence_details_page.heading).to have_text(@licence_reg)

  if @tasktype == "refresh"
    @front_app.licence_details_page.registered_to_link.click if @front_app.licence_details_page.has_registered_to_link?
    # Read the first (latest) security code on screen.
    @security_code = @front_app.licence_details_page.confirmation_first_code.text
  else
    @security_code = @front_app.licence_details_page.confirmation_only_code.text
  end

  puts "Confirmation code is: " + @security_code + "."
  find_link("Sign out").click # Can't use selector due to bug WATER-1905
end

When(/^I enter my confirmation code$/) do
  find_link("Enter your code here").click if @front_app.register_security_code_page.has_text?("Enter your code here")

  expect(@front_app.register_security_code_page.current_url).to include "/security-code"
  @front_app.register_security_code_page.submit(
    security_code_box: @security_code
  )
end

When(/^I select a licence I registered$/) do
  find_link(@licence_reg).click
  expect(@front_app.licence_details_page.heading).to have_text(@licence_reg)
end
