require "uri"

class ExternalAccountSettingsPage < SitePrism::Page

  account_page_url = URI.join(external_application_url, "account/")
  set_url(account_page_url)

end
