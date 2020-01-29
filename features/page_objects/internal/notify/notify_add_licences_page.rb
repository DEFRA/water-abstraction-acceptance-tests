class NotifyAddLicencesPage < SitePrism::Page

  element(:heading, ".govuk-heading-l")
  element(:error_heading, "#error-summary-title")
  element(:error_detail, ".govuk-error-summary__list a")
  element(:instructions, ".govuk-label")
  element(:licence_box, "#system_external_id")
  element(:continue_button, ".govuk-button")

  def submit(args = {})
    licence_box.set(args[:licence_box]) if args.key?(:licence_box)
    continue_button.click
  end

end
