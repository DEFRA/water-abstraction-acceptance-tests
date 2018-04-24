class LicenceDetailsPage < SitePrism::Page

  # Water abstraction licence
  element(:banner_links, ".header-proposition")
  element(:manage_licences_link, "#proposition-links li+ li a")
  element(:abstraction_licences_link, "#content li:nth-child(1) a")
  element(:licence_breadcrumb, "#content li+ li a")
  element(:back_link, ".link-back")
  element(:confirmation_code, ".bold-small") # works for single code only
  element(:licence_rename_error, "#error-summary-heading-example-2")
  element(:name_link, "#nameLicence") # first time
  element(:rename_link, "#showForm") # subsequent times
  element(:licence_name_static, "p+ .data-table .licenceAnswer")
  element(:licence_name_form, "#name")
  element(:save_button, ".button")
  element(:cancel_link, "#nameForm a")
  element(:contact_details, "a[href$='/contact']")
  element(:points_link, "a[href$='/points']")
  element(:conditions_link, "a[href$='/conditions']")
  element(:purpose_period_amounts_link, "a[href$='/purposes']")
  elements(:page_links, "a")

  def submit(args = {})
    licence_name_form.set(args[:licence_name_form]) if args.key?(:licence_name_form)
    save_button.click
  end

  def click_link(args = {})
    return unless args.key?(:text)
    page_links.find("a", text: args[:text]).click
  end

  def click_name_or_rename(_args = {})
    if has_name_link?
      name_link.click
    elsif has_rename_link?
      rename_link.click
    end
  end

end
