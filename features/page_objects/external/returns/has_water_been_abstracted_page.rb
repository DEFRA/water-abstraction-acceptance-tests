require_relative "../../sections/error_summary.rb"

class ExternalReturnsHasWaterBeenAbstractedPage < SitePrism::Page

  set_url "#{external_application_url}return{?returnId}"

  element(:question, "form .govuk-fieldset__legend.govuk-fieldset__legend--m")
  element(:licence_number, ".govuk-caption-l")
  element(:heading, "h1.govuk-heading-l")
  element(:continue_button, "button[type=submit]")

  element(:yes, "#isNil-1", visible: false)
  element(:no, "#isNil-2", visible: false)

  elements(:return_details, "dl.meta .meta__value")

  section(:error_summary, ErrorSummarySection, ".govuk-error-summary")

  def site_description_text
    return_details.first.text
  end

  def purpose_text
    return_details[1].text
  end

  def return_period_text
    return_details[2].text
  end

  def abstraction_period_text
    return_details[3].text
  end

  def submit_answer(answer)
    yes.click if answer.casecmp? "yes"
    no.click if answer.casecmp? "no"
    continue_button.click
  end
end
