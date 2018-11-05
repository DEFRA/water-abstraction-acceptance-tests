class ReturnsPage < SitePrism::Page

  element(:heading, ".heading-large")
  elements(:year_headings, ".heading-medium")
  element(:content, "#content")

  elements(:licences, ".license-result__column--number a")
  elements(:view_links, ".table-cell a")

  # Function to click a link where the URL contains a licence number
  def clickfirstlink(args = {})
    return unless args.key?(:link)
    click_url_text(view_links, args[:link].to_s)
  end

end
