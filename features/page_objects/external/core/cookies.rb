require_relative "../../sections/cookie_banner.rb"

module Pages
  module External
    module Core
      class Cookies < SitePrism::Page
        set_url "#{external_application_url}cookies"
        element(:cookie_banner, ".cookie-message")
      end
    end
  end
end
