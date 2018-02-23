
Given(/^I select Change Password$/) do
  @front_app.licences_page.changepw.click
end

Given(/^I am on the Change Password page$/) do
  expect(@front_app.change_password_page.header).to have_text("Change your password")
  expect(@front_app.change_password_page.current_url).to include "/update_password"
end

Given(/^I enter a password which is too short$/) do
  @front_app.change_password_page.submit(
    password: "Is$h0rt",
    confirmpw: "Is$h0rt"
  )
end

Given(/^I enter a password with no uppercase letters$/) do
  @front_app.change_password_page.submit(
    password: "low£rcase",
    confirmpw: "low£rcase"
  )
end

Given(/^I enter a password with no symbols$/) do
  @front_app.change_password_page.submit(
    password: "N0symbol",
    confirmpw: "N0symbol"
  )
end

Given(/^I enter valid passwords which don't match$/) do
  @front_app.change_password_page.submit(
    password: "S0mething?",
    confirmpw: "S0mething!"
  )
end

Given(/^I see an error telling me the password is invalid$/) do
  expect(@front_app.change_password_page.error_heading.text).to include "Please enter a valid password"
end

Given(/^I see an error telling me the passwords don't match$/) do
  expect(@front_app.change_password_page.error_heading.text).to include "The passwords you entered didn't match"
end

Given(/^I enter a valid password$/) do
  @environment = Quke::Quke.config.custom["current_environment"].to_s
  @front_app.change_password_page.submit(
    password: Quke::Quke.config.custom["data"][@environment]["accounts"]["water_user1"]["password"],
    confirmpw: Quke::Quke.config.custom["data"][@environment]["accounts"]["water_user1"]["password"]
  )
end

Given(/^I see the Password Changed screen$/) do
  expect(@front_app.change_password_confirm_page.confirmation.text).to include "Your password has been changed"
end

Given(/^I request a password reset$/) do
  @environment = Quke::Quke.config.custom["current_environment"].to_s
  @front_app.sign_in_page.forgotten_password.click
  @front_app.request_pw_reset_page.submit(
    email_address: Quke::Quke.config.custom["data"][@environment]["accounts"]["water_user1"]["username"]
  )
end

Given(/^I am on the Check Your Email page$/) do
  expect(@front_app.reset_password_check1_page.heading.text).to include "Check your email"
end
