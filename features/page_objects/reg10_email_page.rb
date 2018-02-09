class RegisterEmailPage < SitePrism::Page

  element(:heading, ".heading-large")
  element(:email_address, "#email")
  element(:continue_button, ".button")

  def submit(args = {})
    email_address.set(args[:email_address]) if args.key?(:email_address)
    continue_button.click
  end

end
