class LicencesPage < SitePrism::Page

  # Your water abstraction licences

  elements(:licences, ".heading-medium license-result__column")

  def submit(args = {})
    return unless args.key?(:licence)
    licences.find { |btn| btn.text == args[:licence] }.click
  end

end
