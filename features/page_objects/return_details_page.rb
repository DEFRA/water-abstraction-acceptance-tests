class ReturnDetailsPage < SitePrism::Page

  element(:banner_links, ".header-proposition")
  element(:view_licences_link, "#navbar-view a")
  element(:manage_licences_link, "#navbar-manage a")
  element(:changepw, "#proposition-links .navlink:nth-child(2) a")
  element(:navbar, ".navbar")
  element(:content, "#content")
  element(:view_licence_link, "br+ p a")
  element(:heading, ".navbar+ .heading-large")
  element(:data_table, ".column-two-thirds")
  element(:freq_heading, "th:nth-child(1)")
  element(:unit_heading, "thead .numeric")
  element(:first_reading, "tbody tr:nth-child(1) .numeric")
  element(:nil_return, "br+ .heading-large")

end
