class ReturnDetailsPage < SitePrism::Page

  element(:heading, "h1")
  element(:content, "#content")
  element(:edit_return_button, ".button")
  element(:view_licence_link, ".medium-space a")
  element(:data_table, ".column-two-thirds")
  element(:freq_heading, ".column-33:nth-child(1)")
  element(:unit_heading, ".column-33.numbers")
  element(:first_reading, ".table-head+ .medium-space .numbers")
  element(:nil_return, "main h2")

end
