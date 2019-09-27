module Pages
  module External
    module Returns
      def self.page_from_question(question)
        case question
        when NIL_RETURN_QUESTION
          NilReturn.new
        when HAVE_YOU_ABSTRACTED_WATER_QUESTION
          HasWaterBeenAbstracted.new
        when HOW_FIGURES_REPORTED
          HowAreYouReportingFigures.new
        when SUBMITTED
          Submitted.new
        else
          raise "Cannot resolve question text to page: #{question}"
        end
      end

      NIL_RETURN_QUESTION = "Nil return".freeze
      HAVE_YOU_ABSTRACTED_WATER_QUESTION = "Have you abstracted water".freeze
      HOW_FIGURES_REPORTED = "How are you reporting your figures".freeze
      SUBMITTED = "Submitted".freeze
    end
  end
end
