class SwitchCompanyPage < SitePrism::Page

  element(:heading, ".govuk-fieldset__heading")
  element(:content, ".govuk-grid-row")

  element(:company_1_radio, "#company", visible: false)
  element(:company_2_radio, "#company-2", visible: false)
  elements(:company_radios, ".govuk-radios__input", visible: false)
  element(:continue_button, ".govuk-button")

end
