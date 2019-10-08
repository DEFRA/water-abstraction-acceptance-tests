Given("I navigate to the cookies page") do
  @last_page = Pages::External::Core::Cookies.new
  @last_page.load
end
