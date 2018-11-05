class RegisterChooseAddressPage < SitePrism::Page

  element(:heading, ".heading-large")
  element(:why_post_link, ".summary")
  # GOV.UK radio buttons have an invisible element.
  element(:address_radio, "input[name='address']", visible: false)
  element(:continue_button, ".button")
  element(:not_mine_link, ".column-two-thirds p a")

end
