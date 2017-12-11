class SignInPage < SitePrism::Page

  element(:email, "#user-id")
  element(:password, "#password")
  element(:disabled_submit_button, "input[aria-disabled='true']")
  element(:submit_button, "input[type='submit']")

  def submit(args = {})
    email.set(args[:email]) if args.key?(:email)
    password.set(args[:password]) if args.key?(:password)
    submit_button.click
  end

  def submit_incorrect_password(args = {})
    refresh_cnt = 0
    loop do
      if has_disabled_submit_button? == false
        email.set(args[:email]) if args.key?(:email)
        password.set "@3kjldjfa@"
        wait_until_submit_button_visible
        submit_button.click
        refresh_cnt = 20
      else
        refresh_cnt += 1
        sleep(1)
      end
      break unless refresh_cnt < 20
    end
  end

end
