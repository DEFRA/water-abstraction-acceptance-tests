module Pages
  module Internal
    module Manage
      class SendPaperForms < BasePage

        def initialize
          current_page_url
        end

        element(:licence_numbers_field, "#licenceNumbers")

        def submit_licence_numbers(licence_numbers)
          licence_numbers_field.set(licence_numbers)
          continue_button.click
        end

      end
    end
  end
end