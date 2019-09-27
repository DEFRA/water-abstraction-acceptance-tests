module Pages
  module External
    module Returns
      class Submitted < SitePrism::Page

        set_url "#{external_application_url}return/submitted{?returnId}"
        set_url_matcher %r{\/return\/submitted\?returnId=}

        element(:title, "h1.panel__title")
        element(:details, ".panel__body.panel__body--small")
        element(:view_return_link, "a", text: "View this return")
      end
    end
  end
end
