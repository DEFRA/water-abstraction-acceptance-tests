class RegisterSendingLetterPage < SitePrism::Page

  element(:heading, ".heading-large")
  element(:address, "p:nth-child(3)")
  element(:sign_out_link, :xpath, "//a[text()='Sign out']")
  element(:security_code, "b")

end
