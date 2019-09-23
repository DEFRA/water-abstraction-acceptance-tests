class ChangePasswordPage < SitePrism::Page

  element(:header, "h1.govuk-heading-l")
  element(:password, "#password")
  element(:confirmpw, "#confirm-password")
  element(:submit_button, "button[type=submit]")
  element(:error_heading, "#error-summary-title")

  def submit(args = {})
    password.set(args[:password]) if args.key?(:password)
    confirmpw.set(args[:confirmpw]) if args.key?(:confirmpw)
    submit_button.click
  end

  def submit_password(password)
    submit(password: password, confirmpw: password)
  end
end
