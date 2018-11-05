class ReturnsRoutesPage < SitePrism::Page

  element(:heading, ".heading-large")
  element(:content, "#content")
  element(:question, ".heading-medium")
  element(:continue_button, "button")

  # Radio buttons - use unique html attributes
  element(:yes_radio, "input[id='radio-inline-0']", visible: false)
  element(:no_radio, "input[id='radio-inline-1']", visible: false)
  element(:nil_return_heading, "h3")
end
