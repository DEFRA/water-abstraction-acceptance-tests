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

        element(:continue_button, "button[type=submit]")

        section(:error_summary, ErrorSummarySection, ".govuk-error-summary")

        element(:manufacturer, "#manufacturer")
        element(:serial_number, "#serialNumber")
        element(:is_multiplier, "#isMultiplier-1")

        def submit_answer(answer = "no answer")
          choose_answer answer
          continue_button.click
        end

        def choose_answer(answer = "no answer")

        end
      end
    end
  end
end
