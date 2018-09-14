class GovukBanner < SitePrism::Section

  # GOV.UK black banner and menu items

  element(:banner_links, ".header-proposition")
  element(:sign_out_link, "#signout a")
  element(:changepw, "#change-password a")
  element(:contact_info_link, "a[href$='/contact-information']")

end
