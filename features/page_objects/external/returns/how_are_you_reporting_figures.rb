require_relative "../../sections/error_summary.rb"

module Pages
  module External
    module Returns
      class HowAreYouReportingFigures < SitePrism::Page

        set_url "#{external_application_url}return/method{?returnId}"
        set_url_matcher %r{\/return\/method\?returnId=.*}

        element(:question, "form .govuk-fieldset__legend.govuk-fieldset__legend--m")
        element(:licence_number, ".govuk-caption-l")
        element(:heading, "h1.govuk-heading-l")
        element(:continue_button, "button[type=submit]")

        element(:single_meter_readings, "#method-1", visible: false)
        element(:volumes, "#method-2", visible: false)
        element(:estimates, "#method-3", visible: false)

        section(:error_summary, ErrorSummarySection, ".govuk-error-summary")
      end
    end
  end
end
