class BasePage < SitePrism::Page

  element(:h1_heading, ".govuk-heading-l")
  element(:continue_button, ".govuk-button")

  def current_page_url
    puts "The page url is: " + page.current_url
  end
end
