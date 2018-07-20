class NotifyAddContactNamePage < SitePrism::Page

  element(:heading, ".heading-large")
  element(:error_heading, "#error-summary-heading")
  element(:error_detail, ".error-summary")
  element(:contact_name, "#contact-name")
  element(:contact_job, "#contact-job-title")
  element(:submit_button, ".button")

  def submit(args = {})
    contact_name.set(args[:contact_name]) if args.key?(:contact_name)
    contact_job.set(args[:contact_job]) if args.key?(:contact_job)
    submit_button.click
  end

end
