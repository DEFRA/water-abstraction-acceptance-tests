module Pages
  module External
    module Returns
      def self.page_from_question(question)
        question_to_page = {
          NIL_RETURN => NilReturn,
          HAVE_YOU_ABSTRACTED_WATER => HasWaterBeenAbstracted,
          HOW_FIGURES_REPORTED => HowAreYouReportingFigures,
          SUBMITTED => Submitted,
          DID_METER_RESET => DidMeterReset,
          WHICH_UNITS => WhichUnits,
          ENTER_METER_READINGS => EnterMeterReadings,
          METER_DETAILS => MeterDetails,
          ENTER_VOLUMES => EnterVolumes,
          CONFIRM_RETURN => ConfirmReturn
        }

        raise "Cannot resolve question text to page: #{question}" unless question_to_page.key? question

        question_to_page[question].new
      end

      NIL_RETURN = "Nil return".freeze
      HAVE_YOU_ABSTRACTED_WATER = "Have you abstracted water".freeze
      HOW_FIGURES_REPORTED = "How are you reporting your figures".freeze
      SUBMITTED = "Submitted".freeze
      DID_METER_RESET = "Did your meter reset".freeze
      WHICH_UNITS = "Which units".freeze
      ENTER_METER_READINGS = "Enter meter readings".freeze
      ENTER_VOLUMES = "Enter volumes".freeze
      METER_DETAILS = "Meter details".freeze
      CONFIRM_RETURN = "Confirm return".freeze
    end
  end
end
