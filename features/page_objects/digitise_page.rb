require_relative "sections/govuk_banner.rb"
require_relative "sections/nav_bar.rb"

class DigitisePage < SitePrism::Page

  section(:govuk_banner, GovukBanner, GovukBanner::SELECTOR)
  section(:nav_bar, NavBar, NavBar::SELECTOR)

  element(:heading, ".heading-large")
  element(:search_form, "#q")
  element(:search_button, ".button")
  element(:single_result, ".column-full a")
  element(:licence_table, ".grid-row+ .grid-row .column-full")

  def search(args = {})
    search_form.set(args[:search_form]) if args.key?(:search_form)
    search_button.click
  end

  def table_count(status_text)
    licence_table.text.scan(/(?=#{status_text})/).count
  end

end
