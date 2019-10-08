Given("I navigate to the privacy policy page") do
  page = Pages::External::Core::PrivacyPolicy.new
  page.load
end
