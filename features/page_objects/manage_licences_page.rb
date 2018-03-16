class ManageLicencesPage < SitePrism::Page

  # Your water abstraction licences

  element(:manage_licences_link, "#proposition-links li+ li a")
  element(:changepw, ".header-links a:nth-child(1)")
  element(:heading, ".heading-large")
  element(:content, "#content")
  element(:add_user_button, ".button")
  element(:access_more_licences_link, ".tabs a")
  elements(:people_with_access, "#results .heading-medium")

end
