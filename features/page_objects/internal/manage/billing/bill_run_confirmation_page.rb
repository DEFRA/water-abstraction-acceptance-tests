module Pages
  module Internal
    module Manage

      class BillRunConfirmationPage < BasePage

        def initialize
          current_page_url
        end

        element(:h1_heading, ".govuk-heading-l")
      end

    end
  end
end
