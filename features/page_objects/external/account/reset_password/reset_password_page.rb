class ResetPasswordPage < SitePrism::Page

  element(:password, "#password")
  element(:confirm_password, "#confirm-password")
  element(:submit_button, "input[type='submit']")

  def submit(args = {})
    password.set(args[:password]) if args.key?(:password)
    confirm_password.set(args[:confirm_password]) if args.key?(:confirm_password)
    submit_button.click
  end

end
