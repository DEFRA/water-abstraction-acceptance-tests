module Pages
  module Internal
    module Manage
      class ReturnsRemindersSuccess < BasePage

        def initialize
          current_page_url
        end

        element(:confirmation_message_title, ".govuk-panel__title")
        element(:confirmation_message_body, ".govuk-panel__body")
        element(:view_report_link, "p > a")

      end
    end
  end
end
