require_relative "sections/govuk_banner.rb"
require_relative "sections/nav_bar.rb"

class LicencesPage < SitePrism::Page

  # Your water abstraction licences

  section(:govuk_banner, GovukBanner, GovukBanner::SELECTOR)
  section(:nav_bar, NavBar, NavBar::SELECTOR)

  element(:navbar, ".navbar") # Used in manage_licences_steps
  element(:external_heading, ".heading-large")
  element(:internal_heading, ".govuk-label--xl")
  element(:content, "#main-content")
  element(:sort_by_number_link, ".license-results-header__column:nth-child(1) .sr-only+ span")
  element(:sort_by_name_link, ".license-results-header__column:nth-child(2) span")
  # rubocop:disable Metrics/LineLength
  element(:sort_by_end_date_link, ".license-results-header__column~ .license-results-header__column+ .license-results-header__column span")
  # rubocop:enable Metrics/LineLength
  elements(:licences, ".license-result__column--number a")
  # see https://github.com/natritmeyer/site_prism#element-collections
  elements(:links, "a")
  elements(:email_links, "#main-content .govuk-link")
  elements(:licence_links_external, ".govuk-table__cell a")
  elements(:licence_links_internal, ".govuk-table__cell a")
  element(:first_licence_external, ".license-results-header+ .license-result a")
  element(:first_licence_internal, ".govuk-table__row:nth-child(1) a")
  element(:search_input, ".search__input")
  element(:search_button, ".search__button")
  element(:triangle, ".sort-icon")
  element(:pagetwo, ".pagination__link")
  element(:pagination_text, ".pagination__current-page")
  element(:disclaimer, ".panel-border-wide p")

  def search(args = {})
    search_input.set(args[:search_input]) if args.key?(:search_input)
    search_button.click
  end

  def clickfirstlink(args = {})
    return unless args.key?(:link)
    click_url_text(links, args[:link].to_s)
  end

end
