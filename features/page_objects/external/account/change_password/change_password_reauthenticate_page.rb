class ChangePasswordReauthenticatePage < SitePrism::Page

  element(:header, "h1.govuk-heading-l")
  element(:password, "#password")
  element(:submit_button, "form button.govuk-button")
  element(:error_heading, "#error-summary-heading")

  def submit(args = {})
    password.set(args[:password]) if args.key?(:password)
    submit_button.click
  end

end
