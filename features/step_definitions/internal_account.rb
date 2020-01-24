Given("I navigate to the {string} section") do |section|
  @back_app = BackOfficeApp.new
  expect(@back_app.back_office_start_page.heading).to have_text("Licences, users and returns")
  @page = Pages::Internal::ManagePage.new
  @page.click_tab section
  @base_page = BasePage.new
  expect(@base_page. h1_heading.text).to have_text("Manage reports and notices")
end
