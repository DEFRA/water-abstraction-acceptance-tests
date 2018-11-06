require_relative "sections/govuk_banner.rb"
require_relative "sections/nav_bar.rb"

class LicencesPage < SitePrism::Page

  # Your water abstraction licences

  section(:govuk_banner, GovukBanner, GovukBanner::SELECTOR)
  section(:nav_bar, NavBar, NavBar::SELECTOR)

  element(:navbar, ".navbar") # Used in manage_licences_steps
  element(:heading, ".heading-large")
  element(:content, "#content")
  element(:sort_by_number_link, ".license-results-header__column:nth-child(1) .sr-only+ span")
  element(:sort_by_name_link, ".license-results-header__column:nth-child(2) span")
  # rubocop:disable Metrics/LineLength
  element(:sort_by_end_date_link, ".license-results-header__column~ .license-results-header__column+ .license-results-header__column span")
  # rubocop:enable Metrics/LineLength
  elements(:licences, ".license-result__column--number a")
  # see https://github.com/natritmeyer/site_prism#element-collections
  elements(:view_links, ".license-result a")
  element(:first_licence, ".license-results-header+ .license-result a")
  element(:licence_result_no, ".license-results-header+ .license-result .license-result__column--number")
  element(:licence_result_name, ".license-results-header+ .license-result .license-result__column--description")
  element(:email_form, "#emailAddress")
  element(:search_form, "#licenceNumber")
  element(:search_button, "#searchButton")
  element(:triangle, ".sort-icon")
  element(:firstlicence, ".license-results-header+ .license-result .heading-medium")
  element(:lastlicence, ".license-result:last-child .heading-medium")
  element(:pagetwo, ".pagination__item:nth-child(3) .pagination__link")
  elements(:pagination_links, ".pagination__link")
  element(:disclaimer, ".panel-border-wide p")

  def search(args = {})
    email_form.set(args[:email_form]) if args.key?(:email_form)
    search_form.set(args[:search_form]) if args.key?(:search_form)
    search_button.click
  end

end
