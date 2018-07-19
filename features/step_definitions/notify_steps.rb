Given(/^I go to the notifications screen$/) do
  @front_app.licences_page.notifications_link.click
  expect(@front_app.notify_menu_page.heading).to have_text("Reports and notifications")
  @environment = Quke::Quke.config.custom["current_environment"].to_s
  @notify_licences = Quke::Quke.config.custom["data"][@environment]["licence_multi"].to_s
  @notify_hof_recipient_count = Quke::Quke.config.custom["data"][@environment]["notify_hof_recipient_count"].to_s
  @notify_exp_recipient_count = Quke::Quke.config.custom["data"][@environment]["notify_exp_recipient_count"].to_s
  @notify_licence_count = Quke::Quke.config.custom["data"][@environment]["notify_licence_count"].to_s
end

Given(/^I select the hands off flow warning template$/) do
  @front_app.notify_menu_page.clicklink(link: "Hands off flow: levels warning")
  expect(@front_app.notify_add_licences_page.heading).to have_text("Send a hands off flow warning")
  @notification_type = "hands off flow warning"
  @notification_type_long = "Hands off flow: levels warning"
end

Given(/^I select the hands off flow stop template$/) do
  @front_app.notify_menu_page.clicklink(link: "Hands off flow: stop or reduce abstraction")
  expect(@front_app.notify_add_licences_page.heading).to have_text("Send a hands off flow restriction notice")
  @notification_type = "hands off flow restriction notice"
  @notification_type_long = "Hands off flow: stop or reduce abstraction"
end

Given(/^I select the hands off flow resume template$/) do
  @front_app.notify_menu_page.clicklink(link: "Hands off flow: resume abstraction")
  expect(@front_app.notify_add_licences_page.heading).to have_text("Send a hands off flow resume notice")
  @notification_type = "hands off flow resume notice"
  @notification_type_long = "Hands off flow: resume abstraction"
end

Given(/^I select the expiry notification template$/) do
  @front_app.notify_menu_page.clicklink(link: "Expiring licence(s): invitation to renew")
  expect(@front_app.notify_add_licences_page.heading).to have_text("Send an invitation to renew")
  @notification_type = "invitation to renew"
  @notification_type_long = "Expiring licence(s): invitation to renew"
end

Given(/^I am on the notification add licences page$/) do
  @front_app.notify_add_licences_page.wait_for_licence_box
  expect(@front_app.notify_add_licences_page.heading).to have_text(@notification_type.to_s)
  # rubocop:disable Metrics/LineLength
  expect(@front_app.notify_add_licences_page.instructions).to have_text("Enter the licence number(s) you want to send a notification about")
  # rubocop:enable Metrics/LineLength
end

Given(/^I add licences for a notification$/) do
  @front_app.notify_add_licences_page.submit(
    licence_box: @notify_licences
  )
  expect(@front_app.notify_confirm_licences_page.heading).to have_text(@notification_type.to_s)
  # rubocop:disable Metrics/LineLength
  expect(@front_app.notify_confirm_licences_page.instructions).to have_text("You can remove any licences you want to exclude from this notification below.")
  # rubocop:enable Metrics/LineLength
  @front_app.notify_confirm_licences_page.wait_for_continue_button
  expect(@front_app.notify_confirm_licences_page).to have_licence_checkboxes count: @notify_licence_count
  @front_app.notify_confirm_licences_page.submit
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
  @front_app.notify_confirm_message_page.wait_for_continue_button
  expect(@front_app.notify_confirm_message_page.number_of_licences).to have_text(@notify_licence_count.to_s)
  if @notification_type == "hands off flow warning"
    expect(@front_app.notify_confirm_message_page.number_of_recipients).to have_text(@notify_hof_recipient_count.to_s)
    # rubocop:disable Metrics/LineLength
    expect(@front_app.notify_confirm_message_page.message_preview).to have_text("This is an advance warning that you may be asked to stop or reduce your water abstraction soon")
    expect(@front_app.notify_confirm_message_page.message_preview).to have_text("If you have any questions about this notification, please contact Water Abstraction Digital Team on water_abstractiondigital@environment-agency.gov.uk")
    # rubocop:enable Metrics/LineLength
  elsif @notification_type == "hands off flow restriction notice"
    expect(@front_app.notify_confirm_message_page.number_of_recipients).to have_text(@notify_hof_recipient_count.to_s)
    # rubocop:disable Metrics/LineLength
    expect(@front_app.notify_confirm_message_page.message_preview).to have_text("We need to enforce the hands off flow condition of your licences because river levels are very low")
    expect(@front_app.notify_confirm_message_page.message_preview).to have_text("If you have any questions about this notification, please contact Water Abstraction Digital Team on water_abstractiondigital@environment-agency.gov.uk")
    # rubocop:enable Metrics/LineLength
  elsif @notification_type == "hands off flow resume notice"
    expect(@front_app.notify_confirm_message_page.number_of_recipients).to have_text(@notify_hof_recipient_count.to_s)
    # rubocop:disable Metrics/LineLength
    expect(@front_app.notify_confirm_message_page.message_preview).to have_text("You can now start or increase your water abstraction, if the terms of your licences allow this")
    expect(@front_app.notify_confirm_message_page.message_preview).to have_text("If you have any questions about this notification, please contact Water Abstraction Digital Team on water_abstractiondigital@environment-agency.gov.uk")
    # rubocop:enable Metrics/LineLength
  elsif @notification_type == "invitation to renew"
    expect(@front_app.notify_confirm_message_page.number_of_recipients).to have_text(@notify_exp_recipient_count.to_s)
    # rubocop:disable Metrics/LineLength
    expect(@front_app.notify_confirm_message_page.message_preview).to have_text("All or part of the following abstraction licences will expire soon")
    expect(@front_app.notify_confirm_message_page.message_preview).to have_text("To discuss any changes you would like to make please call us on 0114 2898 340")
    # rubocop:enable Metrics/LineLength
  end

end

Given(/^I send the notification$/) do
  @front_app.notify_confirm_message_page.continue_button.click
end

Given(/^I can see the correct information on the confirm sent page$/) do
  # rubocop:disable Metrics/LineLength
  expect(@front_app.notify_confirm_sent_page.heading).to have_text("Your " + @notification_type_long.downcase.to_s + " has been sent")
  # rubocop:enable Metrics/LineLength
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
  # rubocop:disable Metrics/LineLength
  expect(@front_app.notify_report_summary_page.first_sender).to have_text(Quke::Quke.config.custom["data"][@environment]["accounts"]["internal_user"]["username"])
  # rubocop:enable Metrics/LineLength
end

Given(/^I can view the details of the latest batch$/) do
  @front_app.notify_report_summary_page.first_notification.click
  expect(@front_app.notify_report_details_page.heading).to have_text(@notification_type_long.to_s)
  expect(@front_app.notify_report_details_page.first_method).to have_text("Letter")
  @front_app.notify_report_details_page.notifications_link.click
end

Given(/^I select no licences$/) do
  @front_app.notify_add_licences_page.submit(
    licence_box: ""
  )
end

Given(/^I see an error message telling me I need at least one licence$/) do
  # rubocop:disable Metrics/LineLength
  expect(@front_app.notify_add_licences_page.error_heading).to have_text("There was a problem with some of the information entered")
  expect(@front_app.notify_add_licences_page.error_detail).to have_text("At least 1 value is required in the licence number(s) field")
  # rubocop:enable Metrics/LineLength
end

Given(/^I leave mandatory fields blank$/) do
  @front_app.notify_custom_info_page.submit(
    gauging_station: "",
    hof_threshold: "0 metres cubed per second",
    contact_details: "",
    sender_name: "A Tester",
    sender_role: "Test person",
    sender_address: "Environment Agency\nDeanery Road\nBristol\nBS1 5AH"
  )
end

Given(/^I see an error message telling me to enter missing data$/) do
  # rubocop:disable Metrics/LineLength
  expect(@front_app.notify_custom_info_page.error_heading).to have_text("There was a problem with some of the information entered")
  # rubocop:enable Metrics/LineLength
  expect(@front_app.notify_custom_info_page.error_detail).to have_text("The Gauging station field is required")
end
