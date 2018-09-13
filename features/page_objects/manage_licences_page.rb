class ManageLicencesPage < SitePrism::Page

  # Your water abstraction licences

  element(:manage_licences_link, "#navbar-manage a")
  element(:changepw, "#change-password a")
  element(:heading, ".heading-large")
  element(:content, "#content")
  element(:add_user_button, ".column-one-third+ .column-one-third a")
  element(:access_more_licences_link, ".tabs a")
  elements(:people_with_access, "#results .heading-medium")

end
