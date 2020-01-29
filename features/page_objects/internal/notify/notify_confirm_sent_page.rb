class NotifyConfirmSentPage < SitePrism::Page

  element(:heading, "h1.govuk-heading-l")
  element(:confirmation_box, ".govuk-panel--confirmation")
  element(:number_of_recipients, ".govuk-panel__body > span")
  element(:report_link, ".govuk-grid-column-two-thirds a")

end
