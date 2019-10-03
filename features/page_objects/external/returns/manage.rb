module Pages
  module External
    module Returns
      class Manage < SitePrism::Page

        set_url "#{external_application_url}returns"

        element(:heading, "h1.govuk-heading-l")
        element(:bulk_upload_link, "p a", text: "send your returns in bulk")
      end
    end
  end
end
