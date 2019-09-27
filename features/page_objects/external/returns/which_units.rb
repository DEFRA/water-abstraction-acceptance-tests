module Pages
  module External
    module Returns
      class WhichUnits < SitePrism::Page

        set_url "#{external_application_url}return/units{?returnId}"
        set_url_matcher %r{\/return\/units\?returnId=}

        element(:question, "govuk-fieldset__legend")
        element(:licence_number, ".govuk-caption-l")
        element(:heading, "h1.govuk-heading-l")
        element(:continue_button, "button[type=submit]")

        element(:cubic_metres, "#units-1")
        element(:litres, "#units-2")
        element(:megalitres, "#units-3")
        element(:gallons, "#units-4")

        def submit_answer(answer = "no answer")
          cubic_metres.click if answer.casecmp? "cubic meters"
          litres.click if answer.casecmp? "litres"
          megalitres.click if answer.casecmp? "megalitres"
          gallons.click if answer.casecmp? "gallons"

          continue_button.click
        end
      end
    end
  end
end
