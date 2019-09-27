module Pages
  module External
    module Returns
      class DidMeterReset < SitePrism::Page

        set_url "#{external_application_url}return/meter/reset{?returnId}"
        set_url_matcher %r{\/return\/meter\/reset\?returnId=}

        element(:question, "govuk-fieldset__legend")
        element(:licence_number, ".govuk-caption-l")
        element(:heading, "h1.govuk-heading-l")
        element(:continue_button, "button[type=submit]")

        element(:yes, "#meterReset-1")
        element(:no, "#meterReset-2")

        def submit_answer(answer = "no answer")
          yes.click if answer.casecmp? "yes"
          no.click if answer.casecmp? "no"
          continue_button.click
        end
      end
    end
  end
end
