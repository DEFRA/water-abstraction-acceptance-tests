class NotifyAddContactDetailsPage < SitePrism::Page

  element(:heading, "h1.govuk-heading-l")
  element(:error_heading, "#error-summary-heading")
  element(:error_detail, ".error-summary")
  element(:contact_email, "#email")
  element(:contact_tel, "#tel")
  element(:contact_address, "#address")
  element(:submit_button, "button.govuk-button")

  def submit(args = {})
    contact_email.set(args[:contact_email]) if args.key?(:contact_email)
    contact_tel.set(args[:contact_tel]) if args.key?(:contact_tel)
    contact_address.set(args[:contact_address]) if args.key?(:contact_address)
    submit_button.click
  end

end
