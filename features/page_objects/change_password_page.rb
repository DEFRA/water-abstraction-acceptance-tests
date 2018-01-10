class ChangePasswordPage < SitePrism::Page

  element(:password, "#password")
  element(:confirmpw, "#confirm-password")
  element(:submit_button, ".button-start")
  element(:error_heading, "#error-summary-heading")

  def submit(args = {})
    password.set(args[:password]) if args.key?(:password)
    confirmpw.set(args[:confirmpw]) if args.key?(:confirmpw)
    submit_button.click
  end

end
