After("@email") do
  # Cleans up emails sent in test
  @front_app.mailinator_page.load
  @front_app.mailinator_page.submit(inbox: Quke::Quke.config.custom["accounts"]["water_user2"]["username"])
  @front_app.mailinator_inbox_page.unlock_email.click
  @front_app.mailinator_inbox_page.delete_email.click
end