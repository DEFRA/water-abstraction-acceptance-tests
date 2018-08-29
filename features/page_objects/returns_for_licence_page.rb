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

  def clickfirstlink(args = {})
    return unless args.key?(:link)
    click_url_text(view_links, args[:link].to_s)
  end

end
