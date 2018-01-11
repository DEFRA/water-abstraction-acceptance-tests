class LicenceDetailsPage < SitePrism::Page

  # Water abstraction licence

  element(:contact_details, "a[href$='/contact'")
  element(:licence_terms, "a[href$='/terms']")

end
