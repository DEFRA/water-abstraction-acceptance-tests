class StartPage < SitePrism::Page

  @environment = Quke::Quke.config.custom["current_environment"].to_s
  set_url(Quke::Quke.config.custom["urls"][@environment]["front_office"])

  # Water management managing your water abstraction or impoundment licence

  element(:sign_in, "a[href$='/signin']")
  element(:create_account, "a[href$='/register']")

  def submit(_args = {})
    scroll_to(sign_in)
    sign_in.click
  end

  def createaccount(_args = {})
    scroll_to(create_account)
    create_account.click
  end

end
