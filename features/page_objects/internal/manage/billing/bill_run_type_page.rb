module Pages
  module Internal
    module Manage

      class BillRunTypePage < BasePage

        def initialize
          current_page_url
        end

        element(:supp_bill_run_type, "#selectedBillingType-2", visible: false)

        def submit_bill_run_type(args = {})
          if args[:type].downcase === page.find('#selectedBillingType-2', :visible => false).value.downcase
            supp_bill_run_type.click
            @base_page = BasePage.new
            @base_page.click_continue
          end
        end
      end
    end
  end
end