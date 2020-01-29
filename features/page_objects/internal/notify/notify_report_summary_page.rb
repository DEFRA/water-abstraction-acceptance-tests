class NotifyReportSummaryPage < SitePrism::Page

  element(:heading, ".govuk-heading-l")
  element(:first_notification, ".govuk-table__row:nth-child(1) .govuk-table__cell a")
  element(:first_sender, ".govuk-table__row:nth-child(1) .govuk-table__cell:nth-child(3)")
  element(:first_recipients, ".govuk-table__row:nth-child(1) .govuk-table__cell--numeric:nth-child(4)")

end
