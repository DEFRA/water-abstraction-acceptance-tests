class GovukBanner < SitePrism::Section

  # GOV.UK black banner and menu items

  SELECTOR ||= ".govuk-header".freeze
  NUNJUCKS_SELECTOR ||= "#navigation".freeze

  element(:sign_out_link, "#signout")
  element(:changepw, "#change-password a")
  element(:contact_info_link, "a[href$='/contact-information']")

end
