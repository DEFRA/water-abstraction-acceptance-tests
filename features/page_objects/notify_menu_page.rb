class NotifyMenuPage < SitePrism::Page

  element(:heading, ".heading-large")
  element(:contact_info_link, "#proposition-links .navlink:nth-child(1) a")

  def clicklink(args = {})
    return unless args.key?(:link)
    find_link(args[:link]).click
  end

end
