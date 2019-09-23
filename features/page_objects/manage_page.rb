require_relative "sections/govuk_banner.rb"

class ManagePage < SitePrism::Page

  url = internal_url(:root)
  set_url(url)

  element :heading, "h1.govuk-heading-l"
  section(:govuk_banner, GovukBanner, GovukBanner::NUNJUCKS_SELECTOR)

  def click_hands_off_flow_link
    find_link("Hands-off flow").click
  end

  def click_renewal_link
    find_link("Renewal").click
  end

  def click_resume_link
    find_link("Resume").click
  end

  def click_restriction_link
    find_link("Restriction").click
  end
end
