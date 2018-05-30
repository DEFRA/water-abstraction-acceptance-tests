class NotifyConfirmLicencesPage < SitePrism::Page

  element(:heading, ".heading-large--tight-above")
  element(:error_heading, "#error-summary-heading-example-1")
  element(:instructions, ".small-space p")
  element(:licence_checkbox, "#checkbox-0")
  elements(:licence_checkboxes, ".medium-space .table-cell:nth-child(1)")
  element(:continue_button, ".button")

  def submit(_args = {})
    continue_button.click
  end

end
