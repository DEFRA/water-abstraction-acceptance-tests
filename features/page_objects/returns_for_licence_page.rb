class ReturnsForLicencePage < SitePrism::Page

  element(:heading, ".heading-large")
  element(:content, "#content")
  element(:returns_table, ".column-full")

  elements(:licences, ".license-result__column--number a")
  elements(:view_links, ".table-cell a")

  def clickfirstlink(args = {})
    return unless args.key?(:link)
    click_url_text(view_links, args[:link].to_s)
  end

end
