class RequestResetPage < SitePrism::Page

  element(:heading, ".heading-large")
  element(:email_address, "#email-address")
  element(:paragraph, ".column-two-thirds p")
  element(:continue_button, ".button-start")

  def submit(args = {})
    email_address.set(args[:email_address]) if args.key?(:email_address)
    continue_button.click
  end

end
