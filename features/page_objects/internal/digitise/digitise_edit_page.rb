require_relative "../../../page_objects/sections/govuk_banner"

class DigitiseEditPage < SitePrism::Page

  section(:govuk_banner, GovukBanner, GovukBanner::SELECTOR)

  element(:heading, ".heading-xlarge")
  elements(:input_box, ".form-control")
  element(:submit_button, ".button")

  def populate_edits
    # Populate random volumes and blanks throughout the return period, regardless of frequency.
    input_box.each do |input|
      random_text = ""
      # Populate field with 5 random letters from a to z
      5.times { random_text += rand(97..122).chr }
      input.set(random_text)
    end
  end

end
