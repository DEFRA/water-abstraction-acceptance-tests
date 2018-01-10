class LicencesPage < SitePrism::Page

  # Your water abstraction licences

  element(:changepw, ".header-links a:nth-child(1)")
  elements(:licences, ".license-result:nth-child(128) .license-result__column")

  def submit(args = {})
    return unless args.key?(:licence)
    licences.find { |btn| btn.text == args[:licence] }.click
  end

end
