class NavBar < SitePrism::Section

  # Navigation bar covering main functions.
  # Different items are visible depending on whether user is internal or external

  SELECTOR ||= ".navbar".freeze

  element(:view_licences_link, "#navbar-view")
  element(:ar_link, "#navbar-ar") # Only works from outside of Digitise tab.
  element(:returns_link, "#navbar-returns")
  element(:manage_licences_link, "#navbar-manage")
  element(:notifications_link, "#navbar-notifications")
  element(:manage_link, "#navbar-notifications")

end
