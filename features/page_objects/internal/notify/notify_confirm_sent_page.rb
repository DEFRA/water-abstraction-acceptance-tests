class NotifyConfirmSentPage < SitePrism::Page

  element(:heading, "h1")
  element(:confirmation_box, ".govuk-box-highlight--accessible")
  element(:number_of_recipients, ".bold-medium")
  element(:report_link, ".column-two-thirds a")

end
