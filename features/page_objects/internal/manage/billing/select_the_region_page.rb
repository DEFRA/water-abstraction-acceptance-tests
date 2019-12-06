module Pages
  module Internal
    module Manage

      class SelectTheRegionPage < BasePage

        def initialize
          current_page_url
        end

        element(:regions, ".govuk-radios", visible: false)

        def submit_region_type(args = {})
          page.all(:css, ".govuk-radios__item", visible: false).each do |s|
            if s.text.eql? args[:type]
              find("#selectedBillingRegion", visible: false).click
              break
            end
          end
          continue
        end

        def continue
          @base_page = BasePage.new
          @base_page.click_continue
        end

      end
    end
  end
end
