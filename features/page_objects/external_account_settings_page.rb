require "uri"

class ExternalAccountSettingsPage < SitePrism::Page

  account_page_url = URI.join(external_url(:root), "account/")
  set_url(account_page_url)

end
