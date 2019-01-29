require_relative "sections/govuk_banner.rb"

class DigitiseEditConditionPage < SitePrism::Page

  section(:govuk_banner, GovukBanner, GovukBanner::SELECTOR)

  element(:heading, ".govuk-heading-l")
  element(:nald_condition_1_radio, "#nald_condition-1", visible: false)
  element(:purpose_2_radio, "#purpose_type-2", visible: false)
  element(:water_body_name, "#water_body_name")
  element(:measurement_point_1_radio, "#measurement_point_type-1", visible: false)
  element(:diagram_type_1_radio, "#measurement_point_diagram_type-1", visible: false)
  element(:hof_hol_flow_input, "#hof_hol_flow")
  element(:unit_3_radio, "#hof_hol_flow_unit-3", visible: false)
  element(:hof_type_2_radio, "#hof_type-2", visible: false)
  element(:submit_button, ".govuk-button")

end
