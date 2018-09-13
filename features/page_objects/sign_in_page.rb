class SignInPage < SitePrism::Page

  @environment = Quke::Quke.config.custom["environment"].to_s
  set_url(Quke::Quke.config.custom["urls"][@environment]["front_office_sign_in"])

  element(:email, "#user-id")
  element(:password, "#password")
  element(:error_heading, "#error-summary-heading")
  element(:submit_button, "#signInButton")
  element(:forgotten_password, ".form+ a")
  element(:create_account_link, "br+ a")

  def submit(args = {})
    email.set(args[:email]) if args.key?(:email)
    password.set(args[:password]) if args.key?(:password)
    submit_button.click
  end

  def lock_account(args = {})
    attempts = 1
    attempt_limit = if args.key?(:limit)
                      args[:limit]
                    else
                      10
                    end
    until attempts == attempt_limit + 1
      email.set(args[:email]) if args.key?(:email)
      password.set "ComeOnFhqwhgads!"
      submit_button.click
      attempts += 1
    end
  end

end
