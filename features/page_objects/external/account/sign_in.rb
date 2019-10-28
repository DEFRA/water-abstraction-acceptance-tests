module Pages
  module External
    module Account
      class SignIn < SitePrism::Page
        url = "#{external_application_url}signin"
        set_url(url)

        element(:email, "#email")
        element(:password, "#password")
        element(:error_heading, ".govuk-error-summary__list")
        element(:submit_button, "button.govuk-button.govuk-button--start")
        element(:forgotten_password, "#main-content a:nth-child(1)")
        element(:create_account_link, "br+ a")

        def submit(args = {})
          email.set(args[:email]) if args.key?(:email)
          password.set(args[:password]) if args.key?(:password)
          submit_button.click
        end

        def submit_credentials(email = "", password = "")
          submit(email: email, password: password)
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
    end
  end
end
