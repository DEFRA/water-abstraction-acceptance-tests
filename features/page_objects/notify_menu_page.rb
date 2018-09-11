class NotifyMenuPage < SitePrism::Page

  element(:heading, ".heading-large")
  element(:contact_info_link, "a[href$='/contact-information']")

  def clicklink(args = {})
    return unless args.key?(:link)
    find_link(args[:link]).click
  end

end
