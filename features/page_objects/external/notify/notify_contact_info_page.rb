class NotifyContactInfoPage < SitePrism::Page

  element(:heading, ".govuk-heading-l")
  element(:error_heading, "#error-summary-heading")
  element(:error_detail, ".error-summary")
  element(:contact_name, "#name")
  element(:contact_job, "#jobTitle")
  element(:contact_email, "#email")
  element(:contact_tel, "#tel")
  element(:contact_address, "#address")
  element(:submit_button, ".govuk-button")

  def submit(args = {})
    contact_name.set(args[:contact_name]) if args.key?(:contact_name)
    contact_job.set(args[:contact_job]) if args.key?(:contact_job)
    contact_email.set(args[:contact_email]) if args.key?(:contact_email)
    contact_tel.set(args[:contact_tel]) if args.key?(:contact_tel)
    contact_address.set(args[:contact_address]) if args.key?(:contact_address)
    submit_button.click
  end

end
