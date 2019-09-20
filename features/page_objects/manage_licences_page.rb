# /manage_licences

class ManageLicencesPage < SitePrism::Page

  element(:heading, "h1.govuk-heading-l")
  element(:content, "#content")
  element(:add_user_button, ".govuk-grid-column-one-third+ .govuk-grid-column-one-third a")
  element(:access_more_licences_link, ".tabs a")
  elements(:people_with_access, "#results .heading-medium")

end
