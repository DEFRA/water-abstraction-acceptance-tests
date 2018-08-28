class ManageAccessRemovedPage < SitePrism::Page

  element(:manage_licences_link, "#navbar-manage a")
  element(:changepw, "#proposition-links .navlink:nth-child(1) a")
  element(:sign_out_link, "#proposition-links .navlink+ .navlink a")
  element(:heading, ".heading-large")
  element(:content, ".column-two-thirds p")
  element(:return_to_licences_link, "p+ a")

end
