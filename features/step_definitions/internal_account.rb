Given("I navigate to the {string} section") do |section|
  @back_app = BackOfficeApp.new
  expect(@back_app.back_office_start_page.heading).to have_text("Licences, users and returns")
  @back_app.back_office_start_page.click_tab section
  @page = Pages::Internal::ManagePage.new
  expect(@page.h1_heading.text).to have_text("Manage reports and notices")
end
