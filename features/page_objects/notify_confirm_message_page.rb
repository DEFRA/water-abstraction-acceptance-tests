class NotifyConfirmMessagePage < SitePrism::Page

  element(:heading, "h1")
  element(:number_of_recipients, ".bold-small:nth-child(1)")
  element(:number_of_licences, ".bold-small+ .bold-small")
  element(:message_preview, ".notification-preview")
  element(:continue_button, ".button")

end
