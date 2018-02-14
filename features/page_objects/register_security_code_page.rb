class RegisterSecurityCodePage < SitePrism::Page

  # Your water abstraction licences

  element(:heading, ".heading-large")
  element(:error_heading, "#error-summary-heading-example-2")
  element(:security_code_box, "#verification_code")
  element(:continue_button, ".button")
  element(:first_licence, "td:nth-child(1)")

  def submit(args = {})
    security_code_box.set(args[:security_code_box]) if args.key?(:security_code_box)
    continue_button.click
  end

end
