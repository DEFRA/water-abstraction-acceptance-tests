require "uri"

module Pages
  module External
    module Account
      class Settings < SitePrism::Page
        account_page_url = URI.join(external_application_url, "account/")
        set_url(account_page_url)
      end
    end
  end
end
