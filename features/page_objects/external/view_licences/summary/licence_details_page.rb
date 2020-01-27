require_relative "../../../../page_objects/sections/govuk_banner"
require_relative "../../../../page_objects/sections/nav_bar"

class LicenceDetailsPage < SitePrism::Page

  section(:govuk_banner, GovukBanner, GovukBanner::SELECTOR)
  section(:nav_bar, NavBar, NavBar::SELECTOR)

  # Global page selectors
  element(:heading, ".govuk-heading-l")
  element(:heading2, "h1")
  element(:summary_tab, "#tab_summary")
  element(:returns_tab, "#tab_returns")
  element(:communications_tab, "#tab_communications")
  element(:content, "#main-content")
  element(:visible_subheading, ".govuk-heading-m")
  element(:licence_date_info, ".govuk-summary-list__row:nth-child(3) .govuk-summary-list__value")
  element(:confirmation_only_code, ".bold-small") # works for single code only

  element(:confirmation_first_code, :xpath, "(//span[@class='govuk-body govuk-!-font-weight-bold'])[1]")
  element(:registered_to_link, :xpath, "//p[text()='Registered to ']/a")

  # Summary tab selectors
  element(:name_rename_link, ".govuk-summary-list__row:nth-child(1) a")
  element(:licence_name_form, "#name")
  element(:licence_rename_error, "#error-summary-heading-example-2")
  element(:save_button, ".govuk-button")
  element(:cancel_link, ".govuk-back-link")
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

  def click_first_link(args = {})
    return unless args.key?(:link)

    click_url_text(view_links, args[:link].to_s)
  end
end
