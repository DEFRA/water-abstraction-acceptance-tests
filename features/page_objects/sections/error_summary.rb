class ErrorSummarySection < SitePrism::Section
  element(:heading, "#error-summary-title")
  elements(:links, ".govuk-error-summary__list a")
end
