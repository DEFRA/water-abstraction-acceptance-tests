require_relative "sections/nav_bar.rb"

class UserDetailsPage < SitePrism::Page

  section(:nav_bar, NavBar, NavBar::SELECTOR)

  element(:caption, ".govuk-caption-l")
  element(:heading, ".break-word")
  element(:content, ".govuk-grid-column-two-thirds")

end
