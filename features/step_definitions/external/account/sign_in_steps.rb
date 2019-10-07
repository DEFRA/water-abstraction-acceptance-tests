Given("I log in at the external test user") do
  sign_in_page = Pages::External::Account::SignIn.new
  sign_in_page.load

  data = @test_data.current_licences_with_returns
  user_name = data["externalPrimaryUser"]["user"]["user_name"]
  sign_in_page.submit_credentials(user_name, "P@55word")
end
