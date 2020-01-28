module Pages
  module Internal
    module Manage
      class SendPaperForms < BasePage

        def initialize
          current_page_url
        end

        element(:licence_numbers_field, "#licenceNumbers")

        section(:error_summary, ErrorSummarySection, ".govuk-error-summary")
        element(:licence_numbers_error, "#licenceNumbers-error")

        def submit_licence_numbers(licence_numbers)
          licence_numbers_field.set(licence_numbers)
          submit_form
        end

        def submit_empty_form
          submit_form
        end

        private

        def submit_form
          continue_button.click
        end

      end
    end
  end
end
