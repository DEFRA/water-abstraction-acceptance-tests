
Given(/^I sign into my account$/) do
  @front_app = FrontOfficeApp.new
  @front_app.start_page.load
  @front_app.start_page.submit
  @front_app.sign_in_page.submit(
    email: Quke::Quke.config.custom["accounts"]["water_user1"]["username"],
    password: Quke::Quke.config.custom["accounts"]["water_user1"]["password"]
  )
end

Given(/^I am in the sign in page$/) do
  @front_app = FrontOfficeApp.new
  @front_app.start_page.load
  @front_app.start_page.submit
end

When(/^I enter my password incorrectly$/) do
  @front_app.sign_in_page.submit(
    email: Quke::Quke.config.custom["accounts"]["water_user2"]["username"],
    password: "@3kjldjfa@"
  )
end

Then(/^I am informed "([^"]*)"$/) do |message|
  expect(@front_app.sign_in_page).to have_text(message)
end
Given(/^I lock my account by attempting to sign in with an incorrect password too many times$/) do
  @front_app = FrontOfficeApp.new
  @front_app.start_page.load
  @front_app.start_page.submit
  # Locks account after ten unsuccessful attempts
  @front_app.sign_in_page.lock_account(email: Quke::Quke.config.custom["accounts"]["water_user2"]["username"])
end
# rubocop:enable Metrics/LineLength
When(/^I unlock my account using the email link provided$/) do
  @front_app.mailinator_home_page.load
  @front_app.mailinator_home_page.submit(inbox: Quke::Quke.config.custom["accounts"]["water_user2"]["username"])
  @front_app.mailinator_inbox_page.email[0].from.click

  @front_app.mailinator_inbox_page.email_details do |frame|
    @new_window = window_opened_by { frame.reset_password.click }
  end

  within_window @new_window do
    @front_app.reset_password_page.submit(
      password: Quke::Quke.config.custom["accounts"]["water_user2"]["password"],
      confirm_password: Quke::Quke.config.custom["accounts"]["water_user2"]["password"]
    )
    @front_app.sign_in_page.submit(
      email: Quke::Quke.config.custom["accounts"]["water_user2"]["username"],
      password: Quke::Quke.config.custom["accounts"]["water_user2"]["password"]
    )
  end
end

Then(/^I can sign into my account$/) do
  within_window @new_window do
    expect(@front_app.licences_page.current_url).to include "/licences"
  end
end
