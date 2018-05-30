class NotifyReportDetailsPage < SitePrism::Page

  element(:heading, ".heading-large--tight-above")
  element(:first_method, "tr:nth-child(1) td:nth-child(3)")

end
