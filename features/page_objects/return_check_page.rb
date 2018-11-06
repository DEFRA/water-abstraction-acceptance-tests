class ReturnCheckPage < SitePrism::Page

  element(:heading, ".heading-large")
  element(:content, "#content")
  element(:heading_mini, ".heading-medium")
  element(:table_total, ".table-foot .numbers")
  element(:table_total_first, ".table-cell--desktop+ .numbers")
  element(:submit_button, "button")

end
