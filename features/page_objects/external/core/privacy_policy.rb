require_relative "../../sections/cookie_banner.rb"

module Pages
  module External
    module Core
      class PrivacyPolicy < SitePrism::Page
        set_url "#{external_application_url}privacy-policy"
        element(:cookie_banner, ".cookie-message")
      end
    end
  end
end
