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
        element(:continue_button, "button[type=submit]")

        element(:yes, "#isNil-1", visible: false)
        element(:no, "#isNil-2", visible: false)

        section(:return_details, Pages::External::Sections::ReturnDetails, ".meta")
        section(:error_summary, ErrorSummarySection, ".govuk-error-summary")

        def submit_answer(answer = "no answer")
          yes.click if answer.casecmp? "yes"
          no.click if answer.casecmp? "no"
          continue_button.click
        end
      end
    end
  end
end
