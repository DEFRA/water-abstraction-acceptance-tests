require_relative "../../sections/error_summary.rb"

module Pages
  module External
    module Returns
      class MeterDetails < SitePrism::Page

        set_url "#{external_application_url}return/meter/details{?returnId}"
        set_url_matcher %r{\/return\/meter\/details\?returnId=.*}

        element(:sub_heading, "h3.govuk-heading-m")
        element(:licence_number, ".govuk-caption-l")
        element(:heading, "h1.govuk-heading-l")

        element(:continue_button, "form button.govuk-button")

        section(:error_summary, ErrorSummarySection, ".govuk-error-summary")

        element(:manufacturer, "#manufacturer")
        element(:manufacturer_error, "#manufacturer-error")

        element(:serial_number, "#serialNumber")
        element(:serial_number_error, "#serialNumber-error")

        element(:multiplier, "#isMultiplier", visible: false)

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
          enter_meter_make if answer.casecmp? "meter make only"
          enter_serial_number if answer.casecmp? "serial number only"
          enter_valid_readings if answer.casecmp? "valid readings"
        end

        private

        def enter_meter_make
          manufacturer.set "Test meter make"
        end

        def enter_serial_number
          serial_number.set "abc123"
        end

        def enter_valid_readings
          enter_meter_make
          enter_serial_number
        end
      end
    end
  end
end
