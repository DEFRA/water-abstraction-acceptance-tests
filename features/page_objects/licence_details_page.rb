require_relative "sections/govuk_banner.rb"
require_relative "sections/nav_bar.rb"

class LicenceDetailsPage < SitePrism::Page

  section(:govuk_banner, GovukBanner, GovukBanner::SELECTOR)
  section(:nav_bar, NavBar, NavBar::SELECTOR)

  element(:heading, ".heading-large")
  element(:licence_date_info, ".heading-large+ p")
  element(:confirmation_only_code, ".bold-small") # works for single code only
  element(:confirmation_first_code, ".bold-small:nth-child(2)") # works for multiple codes assuming most recent first.
  element(:licence_rename_error, "#error-summary-heading-example-2")
  element(:content, "#content")
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
  element(:view_returns_for_licence, ".data-row__value a:nth-child(1)") # for external_user
  element(:view_returns_for_licence_int, ".data-row:nth-child(13) a")
  element(:disclaimer, ".panel-border-wide p")
  elements(:page_links, "a")

  def submit(args = {})
    licence_name_form.set(args[:licence_name_form]) if args.key?(:licence_name_form)
    save_button.click
  end

  def click_name_or_rename(_args = {})
    if has_rename_link?
      rename_link.click
    elsif has_name_link?
      name_link.click
    end
  end

end
