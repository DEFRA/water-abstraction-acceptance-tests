require_relative "../../../page_objects/sections/govuk_banner"
require_relative "../../../page_objects/sections/nav_bar"

class DigitisePage < SitePrism::Page

  section(:govuk_banner, GovukBanner, GovukBanner::SELECTOR)
  section(:nav_bar, NavBar, NavBar::SELECTOR)

  element(:heading, ".govuk-heading-l")
  element(:search_form, "#q")
  element(:search_button, ".govuk-button")
  element(:single_result, :xpath, "//tr/td[1]/a")
  element(:licence_table, ".govuk-table")

  def search(args = {})
    search_form.set(args[:search_form]) if args.key?(:search_form)
    search_button.click
  end

  def table_count(status_text)
    licence_table.text.scan(/(?=#{status_text})/).count
  end

end
