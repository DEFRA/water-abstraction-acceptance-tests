module Pages
  module Internal
    module Manage
      class SendPaperFormsConfirm < BasePage

        def initialize
          current_page_url
        end

        element(:warning_text, ".govuk-warning-text__text")
        element(:send_paper_forms_button, "button.govuk-button")

        def send_paper_forms
          send_paper_forms_button.click
        end

      end
    end
  end
end
