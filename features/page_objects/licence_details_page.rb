require_relative "sections/govuk_banner.rb"
require_relative "sections/nav_bar.rb"

class LicenceDetailsPage < SitePrism::Page

  section(:govuk_banner, GovukBanner, GovukBanner::SELECTOR)
  section(:nav_bar, NavBar, NavBar::SELECTOR)

  # Global page selectors

  element(:heading, ".govuk-heading-l")
  element(:summary_tab, "#tab_summary")
  element(:returns_tab, "#tab_returns")
  element(:communications_tab, "#tab_communications")
  element(:content, "#main-content")
  element(:visible_subheading, ".govuk-heading-m")
  element(:licence_date_info, ".govuk-summary-list__row:nth-child(3) .govuk-summary-list__value")
  element(:confirmation_only_code, ".bold-small") # works for single code only
  # The following works for multiple codes assuming most recent first:
  element(:confirmation_first_code, "li:nth-child(1) .bold-small")

  # Summary tab selectors

  element(:name_rename_link, ".govuk-summary-list__row:nth-child(1) a")
  element(:licence_name_form, "#name")
  element(:licence_rename_error, "#error-summary-heading-example-2")
  element(:save_button, ".button")
  element(:cancel_link, "#nameForm a")
  element(:contact_details, "a[href$='/contact']")
  element(:points_link, "a[href$='/points']")
  element(:conditions_link, "a[href$='/conditions']")
  element(:purpose_period_amounts_link, "a[href$='/purposes']")
  element(:disclaimer, ".govuk-inset-text")

  # Returns tab selectors

  elements(:licences, ".license-result__column--number a")
  elements(:view_links, ".govuk-table__cell a")
  element(:first_return, ".govuk-table__row:nth-child(1) a")
  element(:returns_table, "#returns")

  def submit(args = {})
    licence_name_form.set(args[:licence_name_form]) if args.key?(:licence_name_form)
    save_button.click
  end

  def clickfirstlink(args = {})
    return unless args.key?(:link)
    click_url_text(view_links, args[:link].to_s)
  end

end
