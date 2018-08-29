class ReturnsPage < SitePrism::Page

  element(:banner_links, ".header-proposition")
  element(:view_licences_link, "#navbar-view a")
  element(:manage_licences_link, "#navbar-manage a")
  element(:changepw, "#proposition-links .navlink:nth-child(2) a")
  element(:navbar, ".navbar")
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
