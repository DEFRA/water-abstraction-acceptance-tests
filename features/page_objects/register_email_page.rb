class RegisterEmailPage < SitePrism::Page

  element(:heading, ".heading-large")
  element(:email_address, "#email")
  element(:continue_button, ".button")
  element(:not_received_email_link, ".column-two-thirds a")

  def submit(args = {})
    email_address.set(args[:email_address]) if args.key?(:email_address)
    continue_button.click
  end

  def generate_email
    @random_email = "mywail" + rand(0..999_999_999).to_s + "@example.com"
  end

end
