# Represents all pages in the front office. Was created to avoid needing to
# create individual instances of each page throughout the steps.
# https://github.com/natritmeyer/site_prism#epilogue
class FrontOfficeApp
  # Using an attr_reader automatically gives us a my_app.last_page method
  attr_reader :last_page

  # FRONT OFFICE SPECIFIC PAGES
  # /
  def start_page
    @last_page = StartPage.new
  end

  def sign_in_page
    @last_page = SignInPage.new
  end

  def licences_page
    @last_page = LicencesPage.new
  end

  def licence_details_page
    @last_page = LicenceDetailsPage.new
  end

  def licence_terms_page
    @last_page = LicenceTermsPage.new
  end

  def mailinator_home_page
    @last_page = MailinatorHomePage.new
  end

  def mailinator_email_details_page
    @last_page = MailinatorDetailsPage.new
  end

  def change_password_page
    @last_page = ChangePasswordPage.new
  end

  def change_password_confirm_page
    @last_page = ChangePasswordConfirmPage.new
  end

  def request_pw_reset_page
    @last_page = RequestResetPage.new
  end

  def reset_password_page
    @last_page = ResetPasswordPage.new
  end

  def reset_password_check1_page
    @last_page = ResetPasswordCheck1Page.new
  end

  def mailinator_inbox_page
    @last_page = MailinatorInboxPage.new
  end

end
