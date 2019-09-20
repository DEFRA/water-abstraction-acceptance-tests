class ReturnsPage < SitePrism::Page

  element(:heading, "h1.govuk-heading-l")
  elements(:year_headings, "h2.govuk-heading-m")

  elements(:licences, ".license-result__column--number a")
  elements(:view_links, "main table tr a")

  # Function to click a link where the URL contains a licence number
  def click_first_link(args = {})
    return unless args.key?(:link)
    click_url_text(view_links, args[:link].to_s)
  end

end
