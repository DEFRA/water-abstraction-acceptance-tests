require_relative "../../sections/error_summary.rb"

module Pages
  module External
    module Returns
      class EnterVolumes < SitePrism::Page

        set_url "#{external_application_url}return/quantities{?returnId}"
        set_url_matcher %r{\/return\/quantities\?returnId=.*}

        element(:sub_heading, "h3.govuk-heading-m")
        element(:licence_number, ".govuk-caption-l")
        element(:heading, "h1.govuk-heading-l")

        element(:continue_button, "form button.govuk-button")

        section(:error_summary, ErrorSummarySection, ".govuk-error-summary")

        element(:start_reading, "#startReading")
        element(:start_reading_error, "#startReading-error")
        elements(:volumes, ".govuk-input[type=number]")
        elements(:error_messages, ".govuk-error-message")

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
          enter_valid_equal_readings if answer.casecmp? "identical volumes"
        end

        private

        def enter_valid_equal_readings
          volumes.each do |volume|
            volume.set(5)
          end
        end
      end
    end
  end
end
