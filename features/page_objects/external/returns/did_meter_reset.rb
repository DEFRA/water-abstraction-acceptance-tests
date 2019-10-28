require_relative "../../sections/error_summary.rb"

module Pages
  module External
    module Returns
      class DidMeterReset < SitePrism::Page

        set_url "#{external_application_url}return/meter/reset{?returnId}"
        set_url_matcher %r{\/return\/meter\/reset\?returnId=}

        element(:question, "legend.govuk-fieldset__legend")
        element(:licence_number, ".govuk-caption-l")
        element(:heading, "h1.govuk-heading-l")
        element(:continue_button, "form button.govuk-button")

        section(:error_summary, ErrorSummarySection, ".govuk-error-summary")

        element(:yes, "#meterReset", visible: false)
        element(:no, "#meterReset-2", visible: false)

        element(:meter_reset_error, "#meterReset-error")
        element(:meter_reset_hint, "#meterReset-item-hint")

        element(:back_link, "a.govuk-back-link")

        def choose_answer(answer = "no answer")
          yes.click if answer.casecmp? "yes"
          no.click if answer.casecmp? "no"
        end

        def submit_answer(answer = "no answer")
          if answer.casecmp? "back"
            back_link.click
          else
            choose_answer answer
            continue_button.click
          end
        end
      end
    end
  end
end
