class ManageGiveAccessPage < SitePrism::Page

  element(:manage_licences_link, "#navbar-manage a")
  element(:changepw, ".header-links a:nth-child(1)")
  element(:heading, ".heading-large")
  element(:content, "#content")
  element(:email_form, "#email")
  element(:add_user_button, ".button")
  element(:add_user_button_complete, ".button-start")
  element(:user_list, ".column-full")
  element(:remove_access_link, ".license-result__column--description a")

  def generate_email
    @random_email = "mywail" + rand(0..999_999_999).to_s + "@example.com"
  end

  def submit(args = {})
    email_form.set(args[:email_address]) if args.key?(:email_address)
    add_user_button_complete.click
  end

end
