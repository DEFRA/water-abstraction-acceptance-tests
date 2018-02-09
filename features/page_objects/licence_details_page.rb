class LicenceDetailsPage < SitePrism::Page

  # Water abstraction licence
  element(:abstraction_licences_link, "li:nth-child(1) a")
  element(:licence_breadcrumb, "li+ li a")
  element(:back_link, ".link-back")
  element(:licence_rename_error, ".error-summary-list a")
  element(:rename_link, "#showForm")
  element(:licence_name_static, "p+ .data-table .licenceAnswer")
  element(:licence_name_form, "#name")
  element(:save_button, ".button")
  element(:cancel_link, "#nameForm a")
  element(:contact_details, "a[href$='/contact']")
  element(:points_link, "a[href$='/points']")
  element(:purposes_link, "a[href$='/purposes']")
  element(:conditions_link, "a[href$='/conditions']")

  def submit(args = {})
    licence_name_form.set(args[:licence_name_form]) if args.key?(:licence_name_form)
    save_button.click
  end

end
