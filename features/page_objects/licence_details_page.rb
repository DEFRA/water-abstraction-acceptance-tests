class LicenceDetailsPage < SitePrism::Page

  # Water abstraction licence

  element(:abstraction_licences_link, "li:nth-child(2) a")
  element(:licence_rename_error, ".error-summary-list a")
  element(:rename_link, "#showForm")
  element(:licence_name_static, "p+ .data-table .licenceAnswer")
  element(:licence_name_form, "#name")
  element(:save_button, ".button")
  element(:cancel_link, "#nameForm a")
  element(:contact_details, "a[href$='/contact'")
  element(:licence_terms, "a[href$='/terms']")

  def submit(args = {})
    licence_name_form.set(args[:licence_name_form]) if args.key?(:licence_name_form)
    save_button.click
  end

end
