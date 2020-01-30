class BackOfficeStartPage < SitePrism::Page

  element(:heading, ".govuk-label--xl")

  def click_tab(section)
    find("#navbar-notifications", text: section).click
  end

end
