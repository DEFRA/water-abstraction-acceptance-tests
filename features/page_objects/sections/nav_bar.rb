class NavBar < SitePrism::Section

  # Navigation bar covering main functions.
  # Different items are visible depending on whether user is internal or external

  SELECTOR ||= ".navbar".freeze

  element(:view_licences_link, "#navbar-view a")
  element(:returns_link, "#navbar-returns a")
  element(:manage_licences_link, "#navbar-manage a")
  element(:notifications_link, "#navbar-notifications a")

end
