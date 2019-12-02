require_relative "../../../page_objects/sections/govuk_banner"
require_relative "../../../page_objects/sections/nav_bar"

class ManageAccessRemovedPage < SitePrism::Page
  section(:nav_bar, NavBar, NavBar::SELECTOR)

  element(:sign_out_link, "#signout")
  element(:heading, "h1.govuk-heading-l")
  element(:content, "#content")
  element(:return_to_licences_link, "main p+ a")
end
