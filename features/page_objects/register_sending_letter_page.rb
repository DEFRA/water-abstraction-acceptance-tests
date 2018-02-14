class RegisterSendingLetterPage < SitePrism::Page

  element(:heading, ".heading-large")
  element(:address, "p:nth-child(3)")
  element(:sign_out_link, ".column-two-thirds a")
  element(:security_code, "b")

end
