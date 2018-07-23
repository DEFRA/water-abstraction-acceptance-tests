class NotifyReportDetailsPage < SitePrism::Page

  element(:heading, ".heading-large--tight-above")
  element(:details_table, ".column-full")
  element(:notifications_link, ".active a")

end
