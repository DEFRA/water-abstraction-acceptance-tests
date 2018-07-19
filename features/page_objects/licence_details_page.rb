class LicenceDetailsPage < SitePrism::Page

  # Water abstraction licence
  element(:banner_links, ".header-proposition")
  element(:view_licences_link, ".active a")
  element(:manage_licences_link, ".active+ .navlink a")
  element(:sign_out_link, ".navlink~ .navlink+ .navlink a")
  element(:licence_2nd_heading, ".heading-secondary")
  element(:licence_date_info, ".heading-large+ p")
  element(:confirmation_only_code, ".bold-small") # works for single code only
  element(:confirmation_first_code, ".bold-small:nth-child(2)") # works for multiple codes assuming most recent first.
  element(:licence_rename_error, "#error-summary-heading-example-2")
  element(:first_row, "p+ .data-row")
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
    if has_rename_link?
      rename_link.click
    elsif has_name_link?
      name_link.click
    end
  end

end
