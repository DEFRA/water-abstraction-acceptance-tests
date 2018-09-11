class ManageAccessRemovedPage < SitePrism::Page

  element(:manage_licences_link, "#navbar-manage a")
  element(:changepw, "a[href$='/update_password']")
  element(:sign_out_link, "a[href$='/signout']")
  element(:heading, ".heading-large")
  element(:content, "#content")
  element(:return_to_licences_link, "p+ a")

end
