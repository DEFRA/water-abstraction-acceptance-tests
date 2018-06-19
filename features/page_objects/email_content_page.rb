class EmailContentPage < SitePrism::Page

  def goto_email_api
    @random_email = "mywail" + rand(0..999_999_999).to_s + "@example.com"
    @environment = Quke::Quke.config.custom["current_environment"].to_s
    # rubocop:disable Metrics/LineLength
    @email_api_url = (Quke::Quke.config.custom["urls"][@environment]["email_api"]).to_s + "last?email=" + @reg_email.to_s
    # rubocop:enable Metrics/LineLength
    puts "Email API address: " + @email_api_url
    set_url(@email_api_url)
  end

end
