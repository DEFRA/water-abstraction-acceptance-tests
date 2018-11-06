class ManageChangeAccessPage < SitePrism::Page

  element(:heading, ".heading-large")
  element(:content, "#content")
  element(:manage_returns_checkbox, "input[name='returns']", visible: false)
  element(:remove_access_link, ".form-group a")
  element(:update_access_button, "#submitChange")

end
