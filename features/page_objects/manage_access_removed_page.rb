require_relative "sections/govuk_banner.rb"
require_relative "sections/nav_bar.rb"

class ManageAccessRemovedPage < SitePrism::Page

  section(:govuk_banner, GovukBanner, "#global-header")
  section(:nav_bar, NavBar, ".navbar")

  element(:heading, ".heading-large")
  element(:content, "#content")
  element(:return_to_licences_link, "p+ a")

end
