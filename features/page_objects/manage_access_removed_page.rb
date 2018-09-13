class ManageAccessRemovedPage < SitePrism::Page

  element(:manage_licences_link, "#navbar-manage a")
  element(:changepw, "#change-password a")
  element(:sign_out_link, "#signout a")
  element(:heading, ".heading-large")
  element(:content, "#content")
  element(:return_to_licences_link, "p+ a")

end
