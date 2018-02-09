class MailinatorEmailDetailsPage < SitePrism::Page

  # Mailinator email details page

  element(:reset_password, "a[href*='reset_password_change_password']")
  element(:create_password, "a[href*='/create-password']")

end
