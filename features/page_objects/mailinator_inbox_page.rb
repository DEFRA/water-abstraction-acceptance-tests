class MailinatorInboxPage < SitePrism::Page

  # Mailinator inbox

  sections :email, ".all_message-item" do
    element :from, "div[title='FROM']"
  end

  iframe :email_details, MailinatorEmailDetailsPage, "#msg_body"

end
