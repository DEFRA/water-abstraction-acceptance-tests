module Pages
  module External
    module Returns
      class WhichUnits < SitePrism::Page

        set_url "#{external_application_url}return/units{?returnId}"
        set_url_matcher %r{\/return\/units\?returnId=}

        element(:question, "govuk-fieldset__legend")
        element(:licence_number, ".govuk-caption-l")
        element(:heading, "h1.govuk-heading-l")
        element(:continue_button, "form button.govuk-button")

        element(:cubic_metres, "#units", visible: false)
        element(:litres, "#units-2", visible: false)
        element(:megalitres, "#units-3", visible: false)
        element(:gallons, "#units-4", visible: false)

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
          cubic_metres.click if answer.casecmp? "cubic meters"
          litres.click if answer.casecmp? "litres"
          megalitres.click if answer.casecmp? "megalitres"
          gallons.click if answer.casecmp? "gallons"
        end
      end
    end
  end
end
