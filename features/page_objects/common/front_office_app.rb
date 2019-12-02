# rubocop:disable Metrics/ClassLength
# Represents all pages in the front office. Was created to avoid needing to
# create individual instances of each page throughout the steps.
# https://github.com/natritmeyer/site_prism#epilogue
class FrontOfficeApp
  # Using an attr_reader automatically gives us a my_app.last_page method
  attr_reader :last_page

  # FRONT OFFICE SPECIFIC PAGES
  # /

  def change_password_confirm_page
    @last_page = ChangePasswordConfirmPage.new
  end

  def change_password_page
    @last_page = ChangePasswordPage.new
  end

  def change_password_reauthenticate_page
    @last_page = ChangePasswordReauthenticatePage.new
  end

  def digitise_choose_condition_page
    @last_page = DigitiseChooseConditionPage.new
  end

  def digitise_edit_condition_page
    @last_page = DigitiseEditConditionPage.new
  end

  def digitise_edit_page
    @last_page = DigitiseEditPage.new
  end

  def digitise_page
    @last_page = DigitisePage.new
  end

  def digitise_review_page
    @last_page = DigitiseReviewPage.new
  end

  def email_content_page
    @last_page = EmailContentPage.new
  end

  def flow_level_data
    @last_page = FlowLevelData.new
  end

  def flow_level_page
    @last_page = FlowLevelPage.new
  end

  def internal_search_results_page
    @last_page = InternalSearchResultsPage.new
  end

  def licence_conditions_page
    @last_page = LicenceConditionsPage.new
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

  def licences_page
    @last_page = LicencesPage.new
  end

  def manage_page
    @last_page = ManagePage.new
  end

  def manage_access_removed_page
    @last_page = ManageAccessRemovedPage.new
  end

  def manage_change_access_page
    @last_page = ManageChangeAccessPage.new
  end

  def manage_give_access_page
    @last_page = ManageGiveAccessPage.new
  end

  def manage_licences_page
    @last_page = ManageLicencesPage.new
  end

  def manage_remove_access_page
    @last_page = ManageRemoveAccessPage.new
  end

  def notify_add_contact_details_page
    @last_page = NotifyAddContactDetailsPage.new
  end

  def notify_add_contact_name_page
    @last_page = NotifyAddContactNamePage.new
  end

  def notify_add_licences_page
    @last_page = NotifyAddLicencesPage.new
  end

  def notify_confirm_licences_page
    @last_page = NotifyConfirmLicencesPage.new
  end

  def notify_confirm_message_page
    @last_page = NotifyConfirmMessagePage.new
  end

  def notify_confirm_sent_page
    @last_page = NotifyConfirmSentPage.new
  end

  def notify_contact_info_page
    @last_page = NotifyContactInfoPage.new
  end

  def notify_custom_info_page
    @last_page = NotifyCustomInfoPage.new
  end

  def notify_menu_page
    @last_page = NotifyMenuPage.new
  end

  def notify_report_details_page
    @last_page = NotifyReportDetailsPage.new
  end

  def notify_report_summary_page
    @last_page = NotifyReportSummaryPage.new
  end

  def register_add_licences_page
    @last_page = RegisterAddLicencesPage.new
  end

  def register_confirm_licences_page
    @last_page = RegisterConfirmLicencesPage.new
  end

  def register_choose_address_page
    @last_page = RegisterChooseAddressPage.new
  end

  def register_create_account_page
    @last_page = RegisterCreateAccountPage.new
  end

  def register_create_pw_page
    @last_page = RegisterCreatePasswordPage.new
  end

  def register_email_page
    @last_page = RegisterEmailPage.new
  end

  def register_not_my_licences_page
    @last_page = RegisterNotMyLicencesPage.new
  end

  def register_security_code_page
    @last_page = RegisterSecurityCodePage.new
  end

  def register_sending_letter_page
    @last_page = RegisterSendingLetterPage.new
  end

  def request_pw_reset_page
    @last_page = RequestResetPage.new
  end

  def reset_password_check_page
    @last_page = ResetPasswordCheckPage.new
  end

  def reset_password_page
    @last_page = ResetPasswordPage.new
  end

  def return_check_page
    @last_page = ReturnCheckPage.new
  end

  def return_has_water_been_abstracted
    @last_page = ReturnHasWaterBeenAbstractedPage.new
  end

  def return_date_received_page
    @last_page = ReturnDateReceivedPage.new
  end

  def return_details_page
    @last_page = ReturnDetailsPage.new
  end

  def return_quantities_page
    @last_page = ReturnQuantitiesPage.new
  end

  def return_submitted_page
    @last_page = ReturnSubmittedPage.new
  end

  def returns_page
    @last_page = ReturnsPage.new
  end

  def return_meters_or_readings_page
    @last_page = ReturnMetersOrReadingsPage.new
  end

  def return_meter_details_provided_page
    @last_page = ReturnMeterDetailsProvidedPage.new
  end

  def return_routes_page
    @last_page = ReturnRoutesPage.new
  end

  def return_units_page
    @last_page = ReturnUnitsPage.new
  end

  def sign_in_page
    @last_page = SignInPage.new
  end

  def sign_out_page
    @last_page = SignOutPage.new
  end

  def start_page
    @last_page = StartPage.new
  end

  def switch_company_page
    @last_page = SwitchCompanyPage.new
  end

  def user_details_page
    @last_page = UserDetailsPage.new
  end

end
# rubocop:enable Metrics/ClassLength
