class NotifyAddContactNamePage < SitePrism::Page

  element(:heading, "h1.govuk-heading-l")
  element(:error_heading, "#error-summary-heading")
  element(:error_detail, ".govuk-error-summary")
  element(:contact_name, "#name")
  element(:contact_job, "#jobTitle")
  element(:submit_button, "button.govuk-button")

  def submit(args = {})
    contact_name.set(args[:contact_name]) if args.key?(:contact_name)
    contact_job.set(args[:contact_job]) if args.key?(:contact_job)
    submit_button.click
  end

end
