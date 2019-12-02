class RegisterEmailPage < SitePrism::Page

  element(:heading, "h1.govuk-heading-l")
  element(:email_address, "#email")
  element(:continue_button, "form button.govuk-button")
  element(:not_received_email_link, "main a")

  def submit(args = {})
    email_address.set(args[:email_address]) if args.key?(:email_address)
    continue_button.click
  end

  def generate_email
    @random_email = "mywail" + rand(0..999_999_999).to_s + "@example.com"
  end

end
