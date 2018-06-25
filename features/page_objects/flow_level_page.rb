class FlowLevelPage < SitePrism::Page

  element(:back_link, ".link-back--space-above")
  element(:heading, ".heading-large")
  element(:reading, ".bold-xxlarge")
  element(:unit_selector, "#unit-selector")
  element(:data_info, ".small-space .column-full")
  element(:condition_heading, ".heading-medium")
  element(:condition_link, ".panel-border-wide+ p a")

  def select_unit(args = {})
    unit_selector.select(args[:unit]) if args.key?(:unit)
  end

end
