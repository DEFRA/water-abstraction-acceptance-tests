class LicencesPage < SitePrism::Page

  # Your water abstraction licences

  element(:changepw, ".header-links a:nth-child(1)")
  elements(:licences, ".heading-medium")
  # see https://github.com/natritmeyer/site_prism#element-collections
  elements(:view_links, ".license-result__column--view")
  element(:licence_result_no, ".license-results-header+ .license-result .heading-medium")
  element(:licence_result_name, ".license-results-header+ .license-result .license-result__column--description")
  element(:email_form, "#emailAddress")
  element(:search_form, "#licenceNumber")
  element(:search_button, "#searchButton")
  element(:triangle, ".sort-icon")
  element(:serialno_link, ".license-results-header__column:nth-child(1) a")
  element(:licencename_link, ".license-results-header__column+ .license-results-header__column a")
  element(:johnlicence, ".license-result:nth-child(133) .heading-medium") # 18/54/17/0361
  element(:content, "#content") # all page content
  element(:firstlicence, ".license-results-header+ .license-result .heading-medium")
  element(:lastlicence, ".license-result:last-child .heading-medium")

  def submit(args = {})
    return unless args.key?(:licence)
    licences.find { |btn| btn.text == args[:licence] }.click
  end

  def search(args = {})
    email_form.set(args[:email_form]) if args.key?(:email_form)
    search_form.set(args[:search_form]) if args.key?(:search_form)
    search_button.click
  end

end
