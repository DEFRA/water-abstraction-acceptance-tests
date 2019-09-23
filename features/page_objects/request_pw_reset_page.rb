class RequestResetPage < SitePrism::Page

  element(:heading, ".heading-large")
  element(:email_address, ".govuk-!-width-one-half")
  element(:email_address2, "#email")
  element(:paragraph, :xpath, "//div[@class='govuk-grid-column-two-thirds']/p")
  element(:continue_button, ".button-start")
  element(:continue_button2, ".govuk-button--start")

  def submit(args = {})
    email_address.set(args[:email_address]) if args.key?(:email_address)
    continue_button.click
  end

  def submit2(args = {})
    email_address2.set(args[:email_address]) if args.key?(:email_address)
    continue_button2.click
  end
end
