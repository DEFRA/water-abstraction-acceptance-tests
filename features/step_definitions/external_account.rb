Then("I navigate to the account settings page") do
  page = Pages::External::Account::Settings.new
  page.load
end
