require_relative "sections/govuk_banner.rb"

class DigitiseEditConditionPage < SitePrism::Page

  section(:govuk_banner, GovukBanner, GovukBanner::SELECTOR)

  element(:heading, ".govuk-heading-l")
  element(:nald_condition_1_radio, "#nald_condition", visible: false)
  element(:purpose_2_radio, "#purpose_type-2", visible: false)
  element(:water_body_name, "#water_body_name")
  element(:measurement_point_1_radio, "#measurement_point_type", visible: false)
  element(:diagram_type_1_radio, "#measurement_point_diagram_type", visible: false)
  element(:hof_hol_flow_input, "#hof_hol_flow")
  sleep(20)
  element(:unit_3_radio, "#hof_hol_flow_unit", visible: false)
  element(:hof_type_2_radio, "#hof_type-2", visible: false)
  element(:submit_button, ".govuk-button")

end
