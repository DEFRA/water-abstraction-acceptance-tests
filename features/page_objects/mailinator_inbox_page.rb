class MailinatorInboxPage < SitePrism::Page

  # Mailinator inbox
  element(:unlock_email, :xpath, "//*[normalize-space()='Reset your password to unlock your account']")

  element(:delete_email, ".fa-trash")
  
  iframe :email_details, MailinatorEmailDetailsPage, "#msg_body"

end
