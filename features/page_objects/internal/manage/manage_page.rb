module Pages
  module Internal
    class ManagePage < BasePage

      def initialize
        current_page_url
      end

      def click_tab(section)
        find("#navbar-notifications", text: section).click
      end

      def click_paper_forms
        find_link("Paper forms").click
      end

      def click_invitations
        find_link("Invitations").click
      end

      def click_reminders
        find_link("Reminders").click
      end

      def create_a_bill_run
        find_link("Create a bill run").click
      end

      def view_past_open_bill_runs
        find_link("View past and open bill runs").click
      end
    end
  end
end
