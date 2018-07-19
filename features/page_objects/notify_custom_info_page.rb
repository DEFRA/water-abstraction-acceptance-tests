class NotifyCustomInfoPage < SitePrism::Page

  element(:heading, ".heading-large--tight-above")
  element(:error_heading, "#error-summary-heading-example-1")
  element(:error_detail, ".error-summary")
  # Pick and choose from the following elements depending on notification type:
  element(:gauging_station, "#gauging_station")
  element(:hof_threshold, "#hof_threshold")
  element(:watercourse, "#watercourse")
  element(:stop_day, "#date_of_stop-day")
  element(:stop_month, "#date_of_stop-month")
  element(:stop_year, "#date_of_stop-year")
  element(:apply_day, "#application_date-day")
  element(:apply_month, "#application_date-month")
  element(:apply_year, "#application_date-year")
  # Generic elements:
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
    watercourse.set(args[:watercourse]) if args.key?(:watercourse)
    stop_day.set(args[:stop_day]) if args.key?(:stop_day)
    stop_month.set(args[:stop_month]) if args.key?(:stop_month)
    stop_year.set(args[:stop_year]) if args.key?(:stop_year)
    apply_day.set(args[:apply_day]) if args.key?(:apply_day)
    apply_month.set(args[:apply_month]) if args.key?(:apply_month)
    apply_year.set(args[:apply_year]) if args.key?(:apply_year)
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
