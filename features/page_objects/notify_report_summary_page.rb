class NotifyReportSummaryPage < SitePrism::Page

  element(:heading, ".heading-large")
  element(:first_notification, ".clickable:nth-child(2) a")
  element(:first_sender, ".clickable:nth-child(2) td+ .text")
  element(:first_recipients, ".clickable:nth-child(2) .numeric")

end
