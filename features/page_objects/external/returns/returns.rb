module Pages
  module External
    module Returns
      def self.page_from_question(question)
        case question
        when NIL_RETURN
          NilReturn.new
        when HAVE_YOU_ABSTRACTED_WATER
          HasWaterBeenAbstracted.new
        when HOW_FIGURES_REPORTED
          HowAreYouReportingFigures.new
        when SUBMITTED
          Submitted.new
        when DID_METER_RESET
          DidMeterReset.new
        when WHICH_UNITS
          WhichUnits.new
        else
          raise "Cannot resolve question text to page: #{question}"
        end
      end

      NIL_RETURN = "Nil return".freeze
      HAVE_YOU_ABSTRACTED_WATER = "Have you abstracted water".freeze
      HOW_FIGURES_REPORTED = "How are you reporting your figures".freeze
      SUBMITTED = "Submitted".freeze
      DID_METER_RESET = "Did your meter reset".freeze
      WHICH_UNITS = "Which units".freeze
    end
  end
end
