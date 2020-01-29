class NotifyConfirmMessagePage < SitePrism::Page

  element(:heading, "h1.govuk-heading-l")
  element(:number_of_recipients, :xpath, "//span[@class='govuk-!-font-weight-bold'][1]")
  element(:number_of_licences, :xpath, "//span[@class='govuk-!-font-weight-bold'][2]")
  element(:message_preview, ".notification-preview")
  element(:continue_button, ".govuk-button")

end
