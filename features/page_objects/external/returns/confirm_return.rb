require_relative "../sections/return_details"

module Pages
  module External
    module Returns
      class ConfirmReturn < SitePrism::Page

        set_url "#{external_application_url}return/confirm{?returnId}"
        set_url_matcher %r{\/return\/confirm\?returnId=}

        element(:licence_number, ".govuk-caption-l")
        element(:heading, "h1.govuk-heading-l")
        element(:sub_heading, "h2.govuk-heading-l")
        element(:submit_button, "form button.govuk-button")
        element(:edit_volumes_link, "a", text: "Edit your volumes")
        element(:edit_readings_link, "a", text: "Edit your meter readings")
        element(:back_link, "a.govuk-back-link")

        section(:return_details, Pages::External::Sections::ReturnDetails, ".meta")

        def submit_answer(answer = "no answer")
          submit_button.click if answer.casecmp? "submit"
          edit_readings_link.click if answer.casecmp? "edit readings"
          edit_volumes_link.click if answer.casecmp? "edit volumes"
          back_link.click if answer.casecmp? "back"
        end
      end
    end
  end
end
