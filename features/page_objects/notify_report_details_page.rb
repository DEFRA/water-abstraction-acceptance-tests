require_relative "sections/nav_bar.rb"

class NotifyReportDetailsPage < SitePrism::Page

  section(:nav_bar, NavBar, ".navbar")

  element(:heading, ".heading-large--tight-above")
  element(:details_table, ".column-full")

end
