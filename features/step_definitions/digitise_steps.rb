Given(/^I reset a licence back to in progress$/) do
  expect(production?).to be false
  @ar_licence = Quke::Quke.config.custom["data"]["ar_licence"].to_s

  # Search for a licence
  find_link("Digitise!").click # Can't use selector due to bug WATER-1905
  @front_app.digitise_page.wait_until_heading_visible
  @front_app.digitise_page.wait_until_search_form_visible
  @front_app.digitise_page.search(search_form: @ar_licence)
  @front_app.digitise_page.single_result.click
  expect(@front_app.digitise_review_page.content).to have_text(@ar_licence)

  # Reject the latest changes that have been proposed, if option is available
  if @front_app.digitise_review_page.has_no_radio?
    @front_app.digitise_review_page.no_radio.click
    @front_app.digitise_review_page.submit(
      notes_box: "Automated licence reset at: " + Time.new.inspect
    )
  end
  @front_app.digitise_page.nav_bar.view_licences_link.click
end

Given(/^I propose changes to a licence$/) do
  expect(production?).to be false

  # Go to AR screens
  @front_app.licences_page.nav_bar.ar_link.click
  @front_app.digitise_page.wait_until_heading_visible
  @front_app.digitise_page.wait_until_search_form_visible
  expect(@front_app.digitise_page.heading).to have_text("Review licence data")

  # Set a licence to work with
  @ar_licence = Quke::Quke.config.custom["data"]["ar_licence"].to_s

  # Search for a licence
  @front_app.digitise_page.search(search_form: @ar_licence)
  @front_app.digitise_page.single_result.click
  expect(@front_app.digitise_review_page.content).to have_text(@ar_licence)

  # Edit data on one of three different pages at random
  digitise_sections = [
    ["Edit licence data", "Edit licence"],
    ["Edit licence holder party", "Edit party"],
    ["Edit current licence version", "Edit version"]
  ]

  section_number = rand(0..2)
  # Use the link and heading text corresponding to the random number:
  find_link(digitise_sections[section_number][0]).click
  expect(@front_app.digitise_edit_page.heading).to have_text(digitise_sections[section_number][1])
  expect(@front_app.digitise_edit_page.heading).to have_text(@ar_licence)
  @front_app.digitise_edit_page.populate_edits
  @front_app.digitise_edit_page.submit_button.click

  # Add an extra Hands Off Flow condition
  find_link("Add a condition").click
  find("label", text: "Hands off flows/levels").click
  @front_app.digitise_choose_condition_page.continue_button.click

  # Choose which sub-condition to add
  expect(@front_app.digitise_choose_condition_page.heading).to have_text("Choose a further condition to add")
  find("label", text: "2.3").click
  @front_app.digitise_choose_condition_page.continue_button.click

  # Add data for the specific condition
  # Set random number to help identify condition
  random_digits = rand(0..999_999_999).to_s
  expect(@front_app.digitise_edit_condition_page.heading).to have_text("Link data to this condition")
  @front_app.digitise_edit_condition_page.nald_condition_1_radio.click
  @front_app.digitise_edit_condition_page.purpose_2_radio.click
  @front_app.digitise_edit_condition_page.water_body_name.set("Cheddar")
  # Select first item containing "Cheddar" from the auto-complete
  @front_app.digitise_edit_condition_page.water_body_name.send_keys :arrow_down, :enter, :tab
  @front_app.digitise_edit_condition_page.measurement_point_1_radio.click
  @front_app.digitise_edit_condition_page.diagram_type_1_radio.click
  @front_app.digitise_edit_condition_page.hof_hol_flow_input.set(random_digits)
  @front_app.digitise_edit_condition_page.unit_3_radio.click
  @front_app.digitise_edit_condition_page.hof_type_2_radio.click
  @front_app.digitise_edit_condition_page.submit_button.click

  # Sanity check that new condition is visible on screen by checking the random number used
  expect(@front_app.digitise_review_page.content).to have_text(random_digits)

  # Submit the changes you have proposed
  @front_app.digitise_review_page.submit(
    notes_box: "Automated edit at: " + Time.new.inspect, status: "Review"
  )
  expect(@front_app.digitise_page.heading).to have_text("Review licence data")

  # Count the number of In Progress, Approved, Licence review after first edit
  @no_of_in_progress = @front_app.digitise_page.table_count("In progress")
  @no_of_in_review = @front_app.digitise_page.table_count("In review")
  @no_of_approved = @front_app.digitise_page.table_count("Approved")
  @no_of_lic_review = @front_app.digitise_page.table_count("Licence review")

  @front_app.digitise_page.govuk_banner.sign_out_link.click
  expect(@front_app.sign_out_page.heading).to have_text("You are signed out")
  find_link("Sign in").click
end

When(/^I reject the changes$/) do
  # Search for a licence
  find_link("Digitise!").click
  @front_app.digitise_page.wait_until_heading_visible
  @front_app.digitise_page.wait_until_search_form_visible
  @front_app.digitise_page.search(search_form: @ar_licence)
  @front_app.digitise_page.single_result.click
  expect(@front_app.digitise_review_page.content).to have_text(@ar_licence)

  # Reject the changes that have been proposed
  @front_app.digitise_review_page.no_radio.click
  @front_app.digitise_review_page.submit(
    notes_box: "Automated rejection at: " + Time.new.inspect
  )
end

Then(/^the change is shown as "([^"]*)"$/) do |status|
  # Expect the number of licences in "status" to be one more than after the edit was proposed.
  expect(@front_app.digitise_page.heading).to have_text("Review licence data")

  # Get the original number of licences in a particular status:
  status_count_before = if status == "In progress"
                          @no_of_in_progress
                        elsif status == "In review"
                          @no_of_in_review
                        elsif status == "Approved"
                          @no_of_approved
                        elsif status == "Licence review"
                          @no_of_lic_review
                        end

  # Check that there is one more licence in the new status than before:
  status_count_after = @front_app.digitise_page.table_count(status)
  expect(status_count_after).to eq(status_count_before + 1)
end

When(/^I mark the licence for review$/) do
  # Search for a licence
  find_link("Digitise!").click
  @front_app.digitise_page.wait_until_heading_visible
  @front_app.digitise_page.wait_until_search_form_visible
  @front_app.digitise_page.search(search_form: @ar_licence)
  @front_app.digitise_page.single_result.click
  expect(@front_app.digitise_review_page.content).to have_text(@ar_licence)

  # Reject the changes that have been proposed
  @front_app.digitise_review_page.lic_review_radio.click
  @front_app.digitise_review_page.submit(
    notes_box: "Automated licence review at: " + Time.new.inspect
  )
end

When(/^I approve the changes$/) do
  # Search for the licence
  find_link("Digitise!").click
  @front_app.digitise_page.search(search_form: @ar_licence)
  @front_app.digitise_page.single_result.click
  expect(@front_app.digitise_review_page.content).to have_text(@ar_licence)

  # Approve the changes that have been proposed
  @front_app.digitise_review_page.approved_radio.click
  @front_app.digitise_review_page.submit(
    notes_box: "Automated licence approval at: " + Time.new.inspect
  )
end
