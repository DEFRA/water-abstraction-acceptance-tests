require_relative "sections/govuk_banner.rb"
require_relative "sections/tab_bar.rb"

class LicencesPage < SitePrism::Page

  # Your water abstraction licences

  section(:govuk_banner, GovukBanner, "#global-header") # Work in progress
  section(:tab_bar, TabBar, ".navbar") # Work in progress
  element(:banner_links, ".header-proposition")
  element(:sign_out_link, "#signout a")
  element(:view_licences_link, "#navbar-view a")
  element(:returns_link, "#navbar-returns a")
  element(:manage_licences_link, "#navbar-manage a")
  element(:notifications_link, ".active+ .navlink a")
  element(:changepw, "#change-password a")
  element(:navbar, ".navbar")
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

  def submit(args = {})
    return unless args.key?(:licence)
    find_link(args[:licence]).click
  end

  def search(args = {})
    email_form.set(args[:email_form]) if args.key?(:email_form)
    search_form.set(args[:search_form]) if args.key?(:search_form)
    search_button.click
  end

end
