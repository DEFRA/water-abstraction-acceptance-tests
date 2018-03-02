class SignInPage < SitePrism::Page

  @environment = Quke::Quke.config.custom["current_environment"].to_s
  set_url(Quke::Quke.config.custom["urls"][@environment]["front_office_sign_in"])

  element(:email, "#user-id")
  element(:password, "#password")
  element(:disabled_submit_button, "input[aria-disabled='true']")
  element(:submit_button, "input[type='submit']")
  element(:forgotten_password, ".form+ a")
  element(:create_account_link, "br+ a")

  def submit(args = {})
    email.set(args[:email]) if args.key?(:email)
    password.set(args[:password]) if args.key?(:password)
    submit_button.click
  end

  def lock_account(args = {})
    attempts = 0
    until attempts == 10
      next if has_disabled_submit_button?
      email.set(args[:email]) if args.key?(:email)
      password.set "ComeOnFhqwhgads!"
      submit_button.click
      attempts += 1
    end
  end

end
