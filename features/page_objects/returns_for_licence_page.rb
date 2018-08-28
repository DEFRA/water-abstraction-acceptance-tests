class ReturnsForLicencePage < SitePrism::Page

  element(:banner_links, ".header-proposition")
  element(:view_licences_link, "#navbar-view a")
  element(:manage_licences_link, "#navbar-manage a")
  element(:changepw, "#proposition-links .navlink:nth-child(2) a")
  element(:navbar, ".navbar")
  element(:heading, ".heading-large")
  element(:content, "#content")
  element(:returns_table, ".column-full")

  elements(:licences, ".license-result__column--number a")
  elements(:view_links, ".table-cell a")

  # Function to click a link where the URL contains a licence number
  def clickfirstlink(args = {})
    return unless args.key?(:link)
    # Search regex for a URL containing the licence number:
    search_val = args[:link].to_s
    # Find the first instance of view_links containing the search term and click the link:
    view_links.find { |chk| chk["href"].include?(search_val) }.click
  end

end
