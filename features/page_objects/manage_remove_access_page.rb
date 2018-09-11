class ManageRemoveAccessPage < SitePrism::Page

  element(:manage_licences_link, "#navbar-manage a")
  element(:changepw, "a[href$='/update_password']")
  element(:heading, ".heading-large")
  element(:content, "#content")
  element(:remove_access_button, ".button")

end
