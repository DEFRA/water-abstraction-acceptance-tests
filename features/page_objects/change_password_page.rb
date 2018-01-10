class ChangePasswordPage < SitePrism::Page

  element(:password, "#password")
  element(:confirmpw, "#confirm-password")
  element(:submit_button, ".button-start")
  element(:error_heading, "#error-summary-heading")

  def submit(pw)
    password.set(pw)
    confirmpw.set(pw)
    submit_button.click
  end

end
