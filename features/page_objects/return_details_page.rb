class ReturnDetailsPage < SitePrism::Page

  element(:banner_links, ".header-proposition")
  element(:view_licences_link, "#navbar-view a")
  element(:manage_licences_link, "#navbar-manage a")
  element(:changepw, "#change-password a")
  element(:navbar, ".navbar")
  element(:content, "#content")
  element(:view_licence_link, "br+ p a")
  element(:heading, ".navbar+ .heading-large")
  element(:data_table, ".column-two-thirds")
  element(:freq_heading, ".column-33:nth-child(1)")
  element(:unit_heading, ".column-33.numbers")
  element(:first_reading, ".table-head+ .medium-space .numbers")
  element(:nil_return, "main h2")

end
