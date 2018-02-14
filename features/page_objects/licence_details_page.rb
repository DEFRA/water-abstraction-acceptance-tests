class LicenceDetailsPage < SitePrism::Page

  # Water abstraction licence
  element(:abstraction_licences_link, "#content li:nth-child(1) a")
  element(:licence_breadcrumb, "#content li+ li a")
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
  elements(:page_links, "a")

  def submit(args = {})
    licence_name_form.set(args[:licence_name_form]) if args.key?(:licence_name_form)
    save_button.click
  end

  def click_link(args = {})
    return unless args.key?(:text)
    page_links.find("a", text: args[:text]).click
  end

end
