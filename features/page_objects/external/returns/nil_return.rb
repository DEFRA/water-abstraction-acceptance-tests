require_relative "../../sections/error_summary.rb"
require_relative "../sections/return_details.rb"

module Pages
  module External
    module Returns
      class NilReturn < SitePrism::Page

        set_url "#{external_application_url}return/confirm{?returnId}"
        set_url_matcher %r{\/return\/confirm\?returnId=}

        element(:licence_number, ".govuk-caption-l")
        element(:heading, "h1.govuk-heading-l")
        element(:sub_heading, "h2.govuk-heading-l")
        element(:submit_button, "form button.govuk-button")

        section(:return_details, Pages::External::Sections::ReturnDetails, ".meta")

        element(:back_link, "a.govuk-back-link")

        def submit_answer(answer = "no answer")
          submit_button.click if answer.casecmp? "submit"
          back_link.click if answer.casecmp? "back"
        end
      end
    end
  end
end
