class NotifyMenuPage < SitePrism::Page

  element(:heading, ".heading-large")

  def clicklink(args = {})
    return unless args.key?(:link)
    find_link(args[:link]).click
  end

end
