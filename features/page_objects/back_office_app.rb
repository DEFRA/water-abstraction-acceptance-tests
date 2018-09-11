# Represents all pages in the back office. Was created to avoid needing to
# create individual instances of each page throughout the steps.
# https://github.com/natritmeyer/site_prism#epilogue
class BackOfficeApp
  # Using an attr_reader automatically gives us a my_app.last_page method
  attr_reader :last_page

  # BACK OFFICE SPECIFIC PAGES
  # /

  def back_office_start_page
    @last_page = BackOfficeStartPage.new
  end

end
