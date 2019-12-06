require_relative "../../../page_objects/sections/govuk_banner"
module Pages
  module Internal
    class ManagePage < BasePage

      def initialize
        current_page_url
      end

      element(:heading, ".govuk-heading-l")
      element(:manage_tab, "#navbar-notifications")
      element(:create_a_bill_run, :xpath, "//*[@id='main-content']/ul[4]/li[1]/a")
      element(:view_past_and_open_bill_runs, :xpath, "//*[@id='main-content']/ul[4]/li[2]/a")

      section(:govuk_banner, GovukBanner, GovukBanner::NUNJUCKS_SELECTOR)

      def click_manage_tab
        manage_tab.click
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