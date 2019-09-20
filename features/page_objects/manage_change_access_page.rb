class ManageChangeAccessPage < SitePrism::Page

  element(:heading, "h1.govuk-heading-l")
  element(:content, "#content")
  element(:manage_returns_checkbox, "input[name='returns']", visible: false)
  element(:remove_access_link, "form a.govuk-link")
  element(:update_access_button, "button[type=submit]")

end
