module Pages
  module Internal
    module Manage
      class SendReturnsInvitations < BasePage

        def initialize
          current_page_url
        end

        element(:mailing_list_message, ".govuk-heading-l + p")
        element(:csv_download_link, "p > a")
        element(:send_letters_button, ".govuk-button")

        def send_letters
          send_letters_button.click
        end

      end
    end
  end
end
