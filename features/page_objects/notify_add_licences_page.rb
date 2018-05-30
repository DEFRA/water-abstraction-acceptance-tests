class NotifyAddLicencesPage < SitePrism::Page

  element(:heading, ".heading-large")
  element(:error_heading, "#error-summary-heading-example-1")
  element(:error_detail, ".error-summary-list a")
  element(:instructions, ".form-label-bold")
  element(:licence_box, "#system_external_id")
  element(:continue_button, ".button")

  def submit(args = {})
    licence_box.set(args[:licence_box]) if args.key?(:licence_box)
    continue_button.click
  end

end
