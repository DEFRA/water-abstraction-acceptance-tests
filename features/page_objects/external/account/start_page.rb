class StartPage < SitePrism::Page

  set_url external_url(:welcome)
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
