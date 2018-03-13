class ChangePasswordReauthenticatePage < SitePrism::Page

  element(:header, ".heading-large")
  element(:password, "#password")
  element(:submit_button, ".button-start")
  element(:error_heading, "#error-summary-heading")

  def submit(args = {})
    password.set(args[:password]) if args.key?(:password)
    submit_button.click
  end

end
