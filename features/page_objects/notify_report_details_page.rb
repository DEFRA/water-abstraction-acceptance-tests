require_relative "sections/nav_bar.rb"

class NotifyReportDetailsPage < SitePrism::Page

  section(:nav_bar, NavBar, NavBar::SELECTOR)

  element(:heading, ".govuk-heading-xl")
  element(:details_table, ".govuk-table")

end
