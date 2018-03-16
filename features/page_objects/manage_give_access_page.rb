class ManageGiveAccessPage < SitePrism::Page

  # Your water abstraction licences

  element(:manage_licences_link, "#proposition-links li+ li a")
  element(:changepw, ".header-links a:nth-child(1)")
  element(:heading, ".heading-large")
  element(:content, "#content")
  element(:email_form, "#email")
  element(:add_user_button, ".button-start")

  def generate_email
    @random_email = "mywail" + rand(0..999_999_999).to_s + "@mailinator.com"
  end

  def submit(args = {})
    email_form.set(args[:email_address]) if args.key?(:email_address)
    add_user_button.click
  end

end
