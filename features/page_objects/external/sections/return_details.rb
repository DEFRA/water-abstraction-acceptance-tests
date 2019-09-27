module Pages
  module External
    module Sections
      class ReturnDetails < SitePrism::Section

        elements(:return_details, "dl.meta .meta__value")

        def site_description_text
          return_details.first.text
        end

        def purpose_text
          return_details[1].text
        end

        def return_period_text
          return_details[2].text
        end

        def abstraction_period_text
          return_details[3].text
        end
      end
    end
  end
end
