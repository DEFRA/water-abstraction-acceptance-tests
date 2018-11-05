class ReturnSubmittedPage < SitePrism::Page

  element(:heading, ".heading-large")
  element(:confirmation_box, ".govuk-box-highlight")
  element(:view_return_link, ".column-two-thirds a")

end
