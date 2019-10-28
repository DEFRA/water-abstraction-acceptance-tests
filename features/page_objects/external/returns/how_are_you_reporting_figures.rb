require_relative "../../sections/error_summary.rb"

module Pages
  module External
    module Returns
      class HowAreYouReportingFigures < SitePrism::Page

        set_url "#{external_application_url}return/method{?returnId}"
        set_url_matcher %r{\/return\/method\?returnId=.*}

        element(:question, "h3.govuk-heading-m")
        element(:licence_number, ".govuk-caption-l")
        element(:heading, "h1.govuk-heading-l")
        element(:continue_button, "form button.govuk-button")

        element(:meter_readings, "#method", visible: false)
        element(:volumes, "#method-2", visible: false)
        element(:estimates, "#method-3", visible: false)

        section(:error_summary, ErrorSummarySection, ".govuk-error-summary")
        element(:method_error, "#method-error")

        element(:back_link, "a.govuk-back-link")

        def submit_answer(answer = "no answer")
          if answer.casecmp? "back"
            back_link.click
            sleep 2
          else
            choose_answer answer
            continue_button.click
          end
        end

        def choose_answer(answer = "no answer")
          meter_readings.click if answer.casecmp? "readings"
          volumes.click if answer.casecmp? "volumes"
          estimates.click if answer.casecmp? "estimates"
        end
      end
    end
  end
end
