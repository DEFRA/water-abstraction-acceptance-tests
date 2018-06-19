class NotifyCustomInfoPage < SitePrism::Page

  element(:heading, ".heading-large--tight-above")
  element(:error_heading, "#error-summary-heading-example-1")
  element(:error_detail, ".error-summary-list a")
  # Hands off flow warning elements
  element(:gauging_station, "#gauging_station")
  element(:hof_threshold, "#hof_threshold")
  element(:contact_name, "#contact_name")
  element(:contact_details, "#contact_details")
  element(:sender_name, "#sender_name")
  element(:sender_role, "#sender_role")
  element(:sender_address, "#sender_address")
  element(:submit_button, ".button")

  # rubocop:disable Metrics/AbcSize
  # rubocop:disable Metrics/CyclomaticComplexity
  # rubocop:disable Metrics/PerceivedComplexity
  def submit(args = {})
    gauging_station.set(args[:gauging_station]) if args.key?(:gauging_station)
    hof_threshold.set(args[:hof_threshold]) if args.key?(:hof_threshold)
    contact_name.set(args[:contact_name]) if args.key?(:contact_name)
    contact_details.set(args[:contact_details]) if args.key?(:contact_details)
    sender_name.set(args[:sender_name]) if args.key?(:sender_name)
    sender_role.set(args[:sender_role]) if args.key?(:sender_role)
    sender_address.set(args[:sender_address]) if args.key?(:sender_address)
    submit_button.click
  end
  # rubocop:enable Metrics/AbcSize
  # rubocop:enable Metrics/CyclomaticComplexity
  # rubocop:enable Metrics/PerceivedComplexity

end
