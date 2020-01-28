module Pages
  module Internal
    module Manage
      class ReturnsInvitations < BasePage

        def initialize
          current_page_url
        end

        element(:exclude_licences_field, "#excludeLicences")

        def generate_returns_invitations(licence_numbers = "")
          exclude_licences_field.set(licence_numbers)
          continue_button.click
        end

      end
    end
  end
end
