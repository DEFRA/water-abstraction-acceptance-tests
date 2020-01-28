module Pages
  module Internal
    module Manage
      class Waiting < BasePage

        def initialize
          current_page_url
        end

        element(:waiting_page_message, "p.govuk-body-l")

      end
    end
  end
end
