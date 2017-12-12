class LicencesPage < SitePrism::Page

  # Your water abstraction licences

  elements(:licences, ".licence-title")

  def submit(args = {})
    return unless args.key?(:licence)
    licences.find { |btn| btn.text == args[:licence] }.click
  end

end
