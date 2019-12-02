class LicenceConditionsPage < SitePrism::Page

  # element(:disclaimer, ".bold-small")
  element(:disclaimer, ".govuk-warning-text__text")
  # element(:back_link, ".link-back--space-above") oldcss
  element(:back_link, ".govuk-back-link")
  # element(:heading, ".heading-large")old css
  element(:heading, ".govuk-heading-l")

end
