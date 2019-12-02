class ReturnAdminPage < SitePrism::Page

  element(:heading, ".heading-xlarge")
  element(:status_field, "input[name='status']")
  element(:created_at_field, "input[name='created_at']")
  element(:updated_at_field, "input[name='updated_at']")
  element(:received_date_field, "input[name='received_date']")
  element(:submit_button, "input[type='submit']")

  def submit(args = {})
    status_field.set(args[:status]) if args.key?(:status)
    created_at_field.set(args[:created]) if args.key?(:created)
    updated_at_field.set(args[:updated_at_field]) if args.key?(:updated_at_field)
    received_date_field.set(args[:received_date_field]) if args.key?(:received_date_field)
    submit_button.click
  end

end
