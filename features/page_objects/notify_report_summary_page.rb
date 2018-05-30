class NotifyReportSummaryPage < SitePrism::Page

  element(:heading, ".heading-large")
  element(:first_notification, "tbody+ tbody .clickable:nth-child(1) a")
  element(:first_sender, "tbody+ tbody .clickable:nth-child(1) td+ .text")
  element(:first_recipients, "tbody+ tbody .clickable:nth-child(1) .numeric")

end
