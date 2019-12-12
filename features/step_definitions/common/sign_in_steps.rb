Given("I log in at the external test user") do
  sign_in_page = Pages::External::Account::SignIn.new
  sign_in_page.load

  data = @test_data.current_licences_with_returns
  user_name = data["externalPrimaryUser"]["user"]["user_name"]
  sign_in_page.submit_credentials(user_name, @test_data.password)
end

Given(/^I logged in as ([^"]*) user$/) do |user|
  sign_in_page = Pages::Internal::Account::SignIn.new
  sign_in_page.load

  data = @test_data.internal_users
  user_name = data[user]["user_name"]
  sign_in_page.submit_credentials(user_name, @test_data.password)
end
