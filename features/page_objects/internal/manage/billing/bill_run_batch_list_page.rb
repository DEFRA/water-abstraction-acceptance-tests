module Pages
  module Internal
    module Manage

      class BillRunBatchListPage < BasePage

        def initialize
          current_page_url
        end

        element(:supp_bill_run_type, "#selectedBillingType-2", visible: false)

        def submit_bill_run_type(args = {})
          return unless args[:type].casecmp.eql? page.find("#selectedBillingType-2", visible: false).value.casecmp

          supp_bill_run_type.click
          @base_page = BasePage.new
          @base_page.click_continue
        end
      end
    end
  end
end
