require_relative "sections/nav_bar.rb"

class ReturnDetailsPage < SitePrism::Page

  section(:nav_bar, NavBar, NavBar::SELECTOR)

  element(:heading, "h1")
  element(:content, "#content")
  element(:edit_return_button, ".button")
  element(:heading_mini, "main h2")
  element(:view_licence_link, ".medium-space a")
  # Use this for cubic meter volumes:
  element(:data_table, ".column-two-thirds")
  # Use this for different units and meter readings:
  element(:data_table_full, ".column-full")
  element(:freq_heading, ".column-33:nth-child(1)")
  element(:unit_heading, ".column-33.numbers")
  element(:first_reading, ".table-head+ .medium-space .numbers")
  # Use this for cubic meter volumes:
  element(:table_total, ".table-foot .numbers")
  # Use this for different units and meter readings:
  element(:table_total_first, ".table-cell--desktop+ .numbers")

end
