class RegisterSecurityCodePage < SitePrism::Page

  element(:heading, "h1.govuk-heading-l")
  element(:error_heading, "#error-summary-heading-example-2")
  element(:security_code_box, "#verification_code")
  element(:continue_button, "form button.govuk-button")

  def submit(args = {})
    security_code_box.set(args[:security_code_box]) if args.key?(:security_code_box)
    continue_button.click
  end
end
