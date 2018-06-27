# rubocop:disable Metrics/ClassLength
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

  def licence_contact_page
    @last_page = LicenceContactPage.new
  end

  def licence_details_page
    @last_page = LicenceDetailsPage.new
  end

  def licence_points_page
    @last_page = LicencePointsPage.new
  end

  def licence_purposes_page
    @last_page = LicencePurposesPage.new
  end

  def licence_conditions_page
    @last_page = LicenceConditionsPage.new
  end

  def change_password_reauthenticate_page
    @last_page = ChangePasswordReauthenticatePage.new
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

  def register_create_account_page
    @last_page = RegisterCreateAccountPage.new
  end

  def register_email_page
    @last_page = RegisterEmailPage.new
  end

  def register_create_pw_page
    @last_page = RegisterCreatePasswordPage.new
  end

  def register_add_licences_page
    @last_page = RegisterAddLicencesPage.new
  end

  def register_confirm_licences_page
    @last_page = RegisterConfirmLicencesPage.new
  end

  def register_not_my_licences_page
    @last_page = RegisterNotMyLicencesPage.new
  end

  def register_choose_address_page
    @last_page = RegisterChooseAddressPage.new
  end

  def register_sending_letter_page
    @last_page = RegisterSendingLetterPage.new
  end

  def register_security_code_page
    @last_page = RegisterSecurityCodePage.new
  end

  def manage_licences_page
    @last_page = ManageLicencesPage.new
  end

  def manage_give_access_page
    @last_page = ManageGiveAccessPage.new
  end

  def manage_access_removed_page
    @last_page = ManageAccessRemovedPage.new
  end

  def notify_menu_page
    @last_page = NotifyMenuPage.new
  end

  def notify_add_licences_page
    @last_page = NotifyAddLicencesPage.new
  end

  def notify_confirm_licences_page
    @last_page = NotifyConfirmLicencesPage.new
  end

  def notify_custom_info_page
    @last_page = NotifyCustomInfoPage.new
  end

  def notify_confirm_message_page
    @last_page = NotifyConfirmMessagePage.new
  end

  def notify_confirm_sent_page
    @last_page = NotifyConfirmSentPage.new
  end

  def notify_report_summary_page
    @last_page = NotifyReportSummaryPage.new
  end

  def notify_report_details_page
    @last_page = NotifyReportDetailsPage.new
  end

  def email_content_page
    @last_page = EmailContentPage.new
  end

  def flow_level_page
    @last_page = FlowLevelPage.new
  end

  def flow_level_data
    @last_page = FlowLevelData.new
  end

end
# rubocop:enable Metrics/ClassLength
