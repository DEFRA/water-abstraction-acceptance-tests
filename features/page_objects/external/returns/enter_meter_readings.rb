require_relative "../../sections/error_summary.rb"

module Pages
  module External
    module Returns
      class EnterMeterReadings < SitePrism::Page

        set_url "#{external_application_url}return/meter/readings{?returnId}"
        set_url_matcher %r{\/return\/meter\/readings\?returnId=.*}

        element(:sub_heading, "h3.govuk-heading-m")
        element(:licence_number, ".govuk-caption-l")
        element(:heading, "h1.govuk-heading-l")

        element(:continue_button, "button[type=submit]")

        section(:error_summary, ErrorSummarySection, ".govuk-error-summary")

        element(:start_reading, "#startReading")
        element(:start_reading_error, "#startReading-error")
        elements(:meter_readings, ".govuk-input.input--meter-reading")
        elements(:error_messages, ".govuk-error-message")


        def submit_answer(answer = "no answer")
          choose_answer answer
          continue_button.click
        end

        def choose_answer(answer = "no answer")
          start_reading.set(100) if answer == "start reading only"
          enter_valid_readings if answer == "valid readings"
          enter_valid_equal_readings if answer == "valid equal readings"
          enter_invalid_readings if answer == "invalid readings"
        end

        private
          def enter_valid_readings
            meter_readings.each_with_index do |reading, index|
              value = (index + 1) * 5
              reading.set value
            end
          end

          def enter_valid_equal_readings
            meter_readings.each do |reading|
              reading.set(5)
            end
          end

          def enter_invalid_readings
            meter_readings.each_with_index do |reading, index|
              reading.set(1000 - index)
            end
          end
      end
    end
  end
end
