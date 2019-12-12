module Pages
  module Internal
    module Manage

      class SelectTheRegionPage < BasePage

        def initialize
          current_page_url
        end

        element(:regions, ".govuk-radios", visible: false)

        def submit_region_type(region_name)
          page.all(:css, ".govuk-radios__label", visible: false).each do |region|
            if region.text == region_name
              region.click
              break
            end
          end
          continue_button.click
        end
      end
    end
  end
end
