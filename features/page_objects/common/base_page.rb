class BasePage < SitePrism::Page

  element(:h1_heading, ".govuk-heading-l")
  element(:continue_button, ".govuk-button")

  def click_continue
    continue_button.click
  end

  def heading_title
    h1_heading.text
  end

  def current_page_url
    puts "The page url is: " + page.current_url
  end
end
