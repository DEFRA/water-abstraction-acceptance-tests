class LicenceContactPage < SitePrism::Page

  # element(:back_link, ".link-back--space-above") -old
  element(:back_link, ".govuk-back-link")
  #  element(:heading, ".heading-large--tight-above") oldcss
  element(:heading, ".govuk-heading-l")

  # Registered licence holder details
  # Site contact details
  # Billing contact details
  # Abstraction return contact details

end
