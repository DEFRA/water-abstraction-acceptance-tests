Given(/^I go to the Hands-off flow screen$/) do
  expect(production?).to be false
  @front_app.licences_page.nav_bar.manage_link.click
  expect(@front_app.manage_page.heading).to have_text("Manage reports and notices")
  @front_app.manage_page.click_hands_off_flow_link
end

Given(/^I remove my contact information$/) do
  @front_app.manage_page.load
  @front_app.manage_page.govuk_banner.contact_info_link.click
  expect(@front_app.notify_contact_info_page.heading).to have_text("Contact information")
  @front_app.notify_contact_info_page.submit(
    contact_name: "",
    contact_job: "",
    contact_email: "",
    contact_tel: "",
    contact_address: ""
  )
end

Given(/^I am prompted to add my contact details$/) do
  # @front_app.manage_page.click_hands_off_flow_link
  expect(@front_app.notify_add_contact_name_page.heading).to have_text("Add your contact information")
  @front_app.notify_add_contact_name_page.submit(
    contact_name: "Autopopulated name",
    contact_job: "Autopopulated job"
  )
  expect(@front_app.notify_add_contact_details_page.heading).to have_text("Add your contact information")
  @front_app.notify_add_contact_details_page.submit(
    contact_email: "autopopulated_email@example.com",
    contact_tel: "0117 496 0000",
    # rubocop:disable Layout/LineLength
    contact_address: "Test Autopopulated Address\nDepartment for Environment, Food & Rural Affairs\nHorizon House\nDeanery Road\nBristol\nBS1 5AH"
    # rubocop:enable Layout/LineLength
  )
end

Given(/^I can see my autopopulated details$/) do
  # Bypass auto-populated info and only enter what's in the remaining fields:
  @front_app.notify_custom_info_page.submit(
    watercourse: "River Running",
    gauging_station: "THIS IS A TEST",
    hof_threshold: "0 metres cubed per second"
  )
  # rubocop:disable Layout/LineLength
  expect(@front_app.notify_confirm_message_page.message_preview).to have_text("If you have any questions about this notification, please contact Autopopulated name on 0117 496 0000 or autopopulated_email@example.com")
  # rubocop:enable Layout/LineLength
end

Given(/^I select a template at random$/) do
  # This step chooses one of 3 hof notification templates to send.
  # Because the code is the same for each template, we only need to test one per run.
  # The advantage of this is that the test is quicker to run and doesn't
  # clog up Notify with extra messages.
  @front_app.licences_page.nav_bar.manage_link.click
  expect(@front_app.manage_page.heading).to have_text("Manage reports and notices")

  r = rand(1..4)
  if r == 1
    @front_app.manage_page.click_restriction_link
    expect(@front_app.notify_add_licences_page.heading).to have_text("Send a hands off flow warning")
    @notification_type = "hands off flow warning"
    @notification_type_long = "Hands off flow: levels warning"
  elsif r == 2
    @front_app.manage_page.click_hands_off_flow_link
    expect(@front_app.notify_add_licences_page.heading).to have_text("Send a hands off flow restriction notice")
    @notification_type = "hands off flow restriction notice"
    @notification_type_long = "Hands off flow: stop or reduce abstraction"
  elsif r == 3
    @front_app.manage_page.click_resume_link
    expect(@front_app.notify_add_licences_page.heading).to have_text("Send a hands off flow resume notice")
    @notification_type = "hands off flow resume notice"
    @notification_type_long = "Hands off flow: resume abstraction"
  elsif r == 4
    @front_app.manage_page.click_renewal_link
    expect(@front_app.notify_add_licences_page.heading).to have_text("Send an invitation to renew")
    @notification_type = "invitation to renew"
    @notification_type_long = "Expiring licence(s): invitation to renew"
  end
end

Given(/^I am on the notification add licences page$/) do
  @front_app.notify_add_licences_page.wait_until_licence_box_visible
  expect(@front_app.notify_add_licences_page.heading).to have_text(@notification_type.to_s)
  # rubocop:disable Layout/LineLength
  expect(@front_app.notify_add_licences_page.instructions).to have_text("Enter the licence number(s) you want to send a notification about")
  # rubocop:enable Layout/LineLength
end

Given(/^I add licences for a notification$/) do
  @front_app.notify_add_licences_page.submit(
    licence_box: @notify_licences
  )
  expect(@front_app.notify_confirm_licences_page.heading).to have_text(@notification_type.to_s)
  expect(@front_app.notify_confirm_licences_page).to have_licence_checkboxes count: @notify_licence_count
  @front_app.notify_confirm_licences_page.continue_button.click
end

Given(/^I am on the notification custom information page$/) do
  expect(@front_app.notify_custom_info_page.heading).to have_text(@notification_type.to_s)
end

Given(/^I add custom information$/) do
  if @notification_type == "hands off flow warning"
    @front_app.notify_custom_info_page.submit(
      gauging_station: "THIS IS A TEST",
      hof_threshold: "0 metres cubed per second",
      contact_name: "Water Abstraction Digital Team",
      contact_details: "water_abstractiondigital@environment-agency.gov.uk",
      sender_name: "A Tester",
      sender_role: "Test person",
      sender_address: "Environment Agency\nDeanery Road\nBristol\nBS1 5AH"
    )
  elsif @notification_type == "hands off flow restriction notice"
    @front_app.notify_custom_info_page.submit(
      watercourse: "River Running",
      gauging_station: "THIS IS A TEST",
      hof_threshold: "0 metres cubed per second",
      contact_name: "Water Abstraction Digital Team",
      contact_details: "water_abstractiondigital@environment-agency.gov.uk",
      sender_name: "A Tester",
      sender_role: "Test person",
      sender_address: "Environment Agency\nDeanery Road\nBristol\nBS1 5AH"
    )
  elsif @notification_type == "hands off flow resume notice"
    @front_app.notify_custom_info_page.submit(
      stop_day: "31",
      stop_month: "12",
      stop_year: "1999",
      gauging_station: "THIS IS A TEST",
      hof_threshold: "0 metres cubed per second",
      contact_name: "Water Abstraction Digital Team",
      contact_details: "water_abstractiondigital@environment-agency.gov.uk",
      sender_name: "A Tester",
      sender_role: "Test person",
      sender_address: "Environment Agency\nDeanery Road\nBristol\nBS1 5AH"
    )
  elsif @notification_type == "invitation to renew"
    @front_app.notify_custom_info_page.submit(
      apply_day: "31",
      apply_month: "12",
      apply_year: "1999",
      sender_name: "A Tester",
      sender_role: "Test person",
      sender_address: "Environment Agency\nDeanery Road\nBristol\nBS1 5AH"
    )
  end
end

Given(/^I can see the correct information on the confirm message page$/) do
  @front_app.notify_confirm_message_page.wait_until_continue_button_visible
  expect(@front_app.notify_confirm_message_page.number_of_licences).to have_text(@notify_licence_count.to_s)
  if @notification_type == "hands off flow warning"
    expect(@front_app.notify_confirm_message_page.number_of_recipients).to have_text(@notify_hof_recipient_count.to_s)
    # rubocop:disable Layout/LineLength
    expect(@front_app.notify_confirm_message_page.message_preview).to have_text("This is an advance warning that you may be asked to stop or reduce your water abstraction soon")
    expect(@front_app.notify_confirm_message_page.message_preview).to have_text("If you have any questions about this notification, please contact Water Abstraction Digital Team on water_abstractiondigital@environment-agency.gov.uk")
    # rubocop:enable Layout/LineLength
  elsif @notification_type == "hands off flow restriction notice"
    expect(@front_app.notify_confirm_message_page.number_of_recipients).to have_text(@notify_hof_recipient_count.to_s)
    # rubocop:disable Layout/LineLength
    expect(@front_app.notify_confirm_message_page.message_preview).to have_text("We need to enforce the hands off flow condition of your licence")
    expect(@front_app.notify_confirm_message_page.message_preview).to have_text("If you have any questions about this notification, please contact Water Abstraction Digital Team on water_abstractiondigital@environment-agency.gov.uk")
    # rubocop:enable Layout/LineLength
  elsif @notification_type == "hands off flow resume notice"
    expect(@front_app.notify_confirm_message_page.number_of_recipients).to have_text(@notify_hof_recipient_count.to_s)
    # rubocop:disable Layout/LineLength
    expect(@front_app.notify_confirm_message_page.message_preview).to have_text("You can now start or increase your water abstraction, if the terms of your licence")
    expect(@front_app.notify_confirm_message_page.message_preview).to have_text("If you have any questions about this notification, please contact Water Abstraction Digital Team on water_abstractiondigital@environment-agency.gov.uk")
    # rubocop:enable Layout/LineLength
  elsif @notification_type == "invitation to renew"
    expect(@front_app.notify_confirm_message_page.number_of_recipients).to have_text(@notify_exp_recipient_count.to_s)
    # rubocop:disable Layout/LineLength
    expect(@front_app.notify_confirm_message_page.message_preview).to have_text("All or part of the following abstraction licence")
    expect(@front_app.notify_confirm_message_page.message_preview).to have_text("please send your renewal application")
    # rubocop:enable Layout/LineLength
    expect(@front_app.notify_confirm_message_page.message_preview).to have_text("to us by 31 December 1999")
  end

end

Given(/^I send the notification$/) do
  @front_app.notify_confirm_message_page.continue_button.click
end

Given(/^I can see the correct information on the confirm sent page$/) do
  # rubocop:disable Layout/LineLength
  expect(@front_app.notify_confirm_sent_page.heading).to have_text("Your " + @notification_type_long.downcase.to_s + " has been sent")
  # rubocop:enable Layout/LineLength
  expect(@front_app.notify_confirm_sent_page.confirmation_box).to have_text("You sent this notification to")
  if @notification_type == "invitation to renew"
    expect(@front_app.notify_confirm_sent_page.number_of_recipients).to have_text(@notify_exp_recipient_count.to_s)
  else
    expect(@front_app.notify_confirm_sent_page.number_of_recipients).to have_text(@notify_hof_recipient_count.to_s)
  end
end

Given(/^I check the log$/) do
  @front_app.notify_confirm_sent_page.report_link.click
end

Given(/^the notifications appear in the log$/) do
  expect(@front_app.notify_report_summary_page.first_notification).to have_text(@notification_type_long)

  internal_user = config_accounts "internal_user"
  expect(@front_app.notify_report_summary_page.first_sender).to have_text(internal_user)
end

Given(/^I can view the details of the latest batch$/) do
  @front_app.notify_report_summary_page.first_notification.click
  expect(@front_app.notify_report_details_page.heading).to have_text(@notification_type_long.to_s)
  expect(@front_app.notify_report_details_page.details_table).to have_text("Email")
  expect(@front_app.notify_report_details_page.details_table).to have_text("Letter")
  expect(@front_app.notify_report_details_page.details_table).to have_text("Sent")
  expect(@front_app.notify_report_details_page.details_table).to have_text("Coventry")
  @front_app.notify_report_details_page.nav_bar.notifications_link.click
end

Given(/^I select no licences$/) do
  @front_app.notify_add_licences_page.submit(
    licence_box: ""
  )
end

Given(/^I see an error message telling me I need at least one licence$/) do
  # rubocop:disable Layout/LineLength
  expect(@front_app.notify_add_licences_page.error_heading).to have_text("There is a problem")
  expect(@front_app.notify_add_licences_page.error_detail).to have_text("At least 1 value is required in the licence number(s) field")
  # rubocop:enable Layout/LineLength
end

Given(/^I leave mandatory fields blank$/) do
  @front_app.notify_custom_info_page.submit(
    sender_name: "",
    sender_role: "Test person",
    sender_address: ""
  )
end

Given(/^I see an error message telling me to enter missing data$/) do
  # rubocop:disable Layout/LineLength
  expect(@front_app.notify_custom_info_page.error_heading).to have_text("There was a problem with some of the information entered")
  # rubocop:enable Layout/LineLength
  if @notification_type == "invitation to renew"
    # rubocop:disable Layout/LineLength
    expect(@front_app.notify_custom_info_page.error_detail).to have_text("The Renewal application deadline field is required")
    # rubocop:enable Layout/LineLength
  else
    expect(@front_app.notify_custom_info_page.error_detail).to have_text("The Gauging station field is required")
  end
end
