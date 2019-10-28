require_relative "../../sections/error_summary.rb"
require_relative "../sections/return_details.rb"

module Pages
  module External
    module Returns
      class HasWaterBeenAbstracted < SitePrism::Page

        set_url "#{external_application_url}return{?returnId}"

        element(:question, "form .govuk-fieldset__legend.govuk-fieldset__legend--m")
        element(:licence_number, ".govuk-caption-l")
        element(:heading, "h1.govuk-heading-l")
        element(:continue_button, "form button.govuk-button")

        element(:yes, "#isNil", visible: false)
        element(:no, "#isNil-2", visible: false)

        section(:return_details, Pages::External::Sections::ReturnDetails, ".meta")
        section(:error_summary, ErrorSummarySection, ".govuk-error-summary")

        element(:back_link, "a.govuk-back-link")

        def submit_answer(answer = "no answer")
          if answer.casecmp? "back"
            back_link.click
          else
            choose_answer answer
            continue_button.click
          end
        end

        def choose_answer(answer = "no answer")
          yes.click if answer.casecmp? "yes"
          no.click if answer.casecmp? "no"
        end
      end
    end
  end
end
