require_relative "sections/govuk_banner.rb"
require_relative "sections/nav_bar.rb"

class ManageAccessRemovedPage < SitePrism::Page
  section(:nav_bar, NavBar, NavBar::SELECTOR)

  element(:sign_out_link, "#signout")
  element(:heading, "h1.govuk-heading-l")
  element(:content, "#content")
  element(:return_to_licences_link, "main p+ a")
end
