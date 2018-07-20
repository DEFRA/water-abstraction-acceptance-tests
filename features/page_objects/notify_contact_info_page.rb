class NotifyContactInfoPage < SitePrism::Page

  element(:heading, ".heading-large")
  element(:error_heading, "#error-summary-heading")
  element(:error_detail, ".error-summary")
  element(:contact_name, "#contact-name")
  element(:contact_job, "#contact-job-title")
  element(:contact_email, "#contact-email")
  element(:contact_tel, "#contact-tel")
  element(:contact_address, "#contact-address")
  element(:submit_button, ".button")

  def submit(args = {})
    contact_name.set(args[:contact_name]) if args.key?(:contact_name)
    contact_job.set(args[:contact_job]) if args.key?(:contact_job)
    contact_email.set(args[:contact_email]) if args.key?(:contact_email)
    contact_tel.set(args[:contact_tel]) if args.key?(:contact_tel)
    contact_address.set(args[:contact_address]) if args.key?(:contact_address)
    submit_button.click
  end

end
