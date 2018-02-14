class RegisterChooseAddressPage < SitePrism::Page

  element(:heading, ".heading-large")
  element(:why_post_link, ".summary")
  element(:address_radio, ".multiple-choice")
  element(:continue_button, ".button")
  element(:not_mine_link, ".column-two-thirds p a")

  def submit(_args = {})
    address_radio.click
    continue_button.click
  end

end
