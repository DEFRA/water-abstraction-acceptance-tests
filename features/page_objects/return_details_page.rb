require_relative "sections/nav_bar.rb"

class ReturnDetailsPage < SitePrism::Page

  section(:nav_bar, NavBar, NavBar::SELECTOR)

  element(:heading, ".govuk-caption-l")
  element(:heading1, "h1")
  element(:heading2, ".heading-large")
  element(:content, "#main-content")
  element(:edit_return_button, ".button")
  element(:heading_mini, "main h2")
  element(:view_licence_link, ".medium-space a")
  element(:return_info, ".small-space")
  # Use this for cubic meter volumes:
  element(:data_table, ".column-two-thirds")
  # Use this for different units and meter readings:
  element(:data_table_full, ".column-full")
  element(:freq_heading, ".column-33:nth-child(1)")
  element(:unit_heading, ".column-33.numbers")

  # Use this for cubic meter volumes:
  element(:table_total, ".table-foot .numbers")
  # Use this for different units and meter readings:
  element(:table_total_first, ".table-cell--desktop+ .numbers")

end
