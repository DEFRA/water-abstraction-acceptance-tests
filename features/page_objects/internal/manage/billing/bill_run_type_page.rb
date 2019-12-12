module Pages
  module Internal
    module Manage

      class BillRunTypePage < BasePage

        def initialize
          current_page_url
        end

        element(:supp_bill_run_type, "#selectedBillingType-2", visible: false)

        def submit_bill_run_type(bill_run_type)
          type = page.find("#selectedBillingType-2", visible: false).value
          return unless type.casecmp(bill_run_type).zero?

          supp_bill_run_type.click
          continue_button.click
        end
      end
    end
  end
end
