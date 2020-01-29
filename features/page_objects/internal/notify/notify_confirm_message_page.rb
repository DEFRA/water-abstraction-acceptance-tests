class NotifyConfirmMessagePage < SitePrism::Page

  element(:heading, "h1.govuk-heading-l")
  # govuk-!-font-weight-bold is not a valid selector, even with escape character
  element(:number_of_recipients, ".govuk-grid-column-two-thirds > p > span:nth-child(1)")
  element(:number_of_licences, ".govuk-grid-column-two-thirds > p > span:nth-child(3)")
  element(:message_preview, ".notification-preview")
  element(:continue_button, ".govuk-button")

end
