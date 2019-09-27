require_relative "../../sections/error_summary.rb"

module Pages
  module External
    module Returns
      class NilReturn < SitePrism::Page

        set_url "#{external_application_url}return/confirm{?returnId}"
        set_url_matcher %r{\/return\/confirm\?returnId=}

        element(:licence_number, ".govuk-caption-l")
        element(:heading, "h1.govuk-heading-l")
        element(:submit_button, "button[type=submit]")

        section(:error_summary, ErrorSummarySection, ".govuk-error-summary")
      end
    end
  end
end
