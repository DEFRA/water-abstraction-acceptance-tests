class TabBar < SitePrism::Section

  # Tab bar covering main functions.
  # Different items are visible depending on whether user is internal or external

  element(:view_licences_link, "#navbar-view a")
  element(:navbar, ".navbar")
  element(:returns_link, "#navbar-returns a")
  element(:manage_licences_link, "#navbar-manage a")
  element(:notifications_link, ".active+ .navlink a")

end
