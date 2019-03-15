class ManageGiveAccessPage < SitePrism::Page

  element(:heading, ".heading-large")
  element(:content, "#content")
  element(:email_form, "#email")
  element(:add_user_button, ".button")
  element(:user_list, ".column-full")
  elements(:change_links, "#results a")
  element(:remove_access_link, "#results a")

  def generate_email
    @random_email = "mywail" + rand(0..999_999_999).to_s + "@example.com"
  end

  def submit(args = {})
    email_form.set(args[:email_address]) if args.key?(:email_address)
    add_user_button.click
  end

end
