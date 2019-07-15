class ReturnCheckPage < SitePrism::Page

  element(:heading, ".heading-large")
  element(:content, "#content")
  element(:heading_mini, ".govuk-heading-m")
  element(:table_total, "#main-content strong")
  element(:table_total_first, ":nth-child(3) strong")
  element(:submit_button, "button")

end
