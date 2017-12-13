class StartPage < SitePrism::Page

  set_url(Quke::Quke.config.custom["urls"]["front_office"])

  # Water management managing your water abstraction or impoundment licence

  element(:sign_in, "a[href$='signin']")

  def submit(_args = {})
    scroll_to(sign_in)
    sign_in.click
  end

end
