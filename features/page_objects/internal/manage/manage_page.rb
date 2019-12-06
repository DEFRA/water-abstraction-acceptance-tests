require_relative "../../../page_objects/sections/govuk_banner"
module Pages
  module Internal
    class ManagePage < BasePage

      def initialize
        current_page_url
      end

      def click_tab section
        find("#navbar-notifications", :text => section).click
      end

      def create_a_bill_run
        find("a", :text => "Create a bill run").click
      end

      def view_past_open_bill_runs
        find("a", :text => "View past and open bill runs").click
      end
    end
  end
end
