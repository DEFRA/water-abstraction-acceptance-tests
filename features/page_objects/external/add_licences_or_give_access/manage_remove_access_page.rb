class ManageRemoveAccessPage < SitePrism::Page
  element(:heading, "h1.govuk-heading-l")
  element(:content, "#content")
  element(:remove_access_button, "form button.govuk-button")
end
