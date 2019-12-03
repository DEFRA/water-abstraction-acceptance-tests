require_relative "../../../page_objects/sections/nav_bar"

class NotifyReportDetailsPage < SitePrism::Page

  section(:nav_bar, NavBar, NavBar::SELECTOR)

  element(:heading, ".govuk-heading-xl")
  element(:details_table, ".govuk-table")

end
