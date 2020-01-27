module Pages
  module Internal
    module Manage
      class SendPaperFormsIssue < BasePage

        def initialize
          current_page_url
        end

        element(:invalid_licence_numbers, ".govuk-list")

      end
    end
  end
end
