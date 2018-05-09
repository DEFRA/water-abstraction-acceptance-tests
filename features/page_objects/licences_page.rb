class LicencesPage < SitePrism::Page

  # Your water abstraction licences

  element(:banner_links, ".header-proposition")
  element(:view_licences_link, ".active a")
  element(:manage_licences_link, ".active+ .navlink a")
  element(:changepw, "#proposition-links .navlink:nth-child(1) a")
  element(:navbar, ".navbar")
  element(:heading, ".heading-large")
  element(:content, "#content")
  elements(:licences, ".license-result__column--number a")
  # see https://github.com/natritmeyer/site_prism#element-collections
  elements(:view_links, ".license-result a")
  element(:first_licence, ".license-results-header+ .license-result a")
  element(:licence_result_no, ".license-results-header+ .license-result a")
  element(:licence_result_name, ".license-results-header+ .license-result .license-result__column--description")
  element(:email_form, "#emailAddress")
  element(:search_form, "#licenceNumber")
  element(:search_button, "#searchButton")
  element(:triangle, ".sort-icon")
  element(:johnlicence, ".license-result:nth-child(133) .heading-medium") # 18/54/17/0361
  element(:firstlicence, ".license-results-header+ .license-result .heading-medium")
  element(:lastlicence, ".license-result:last-child .heading-medium")
  element(:pagetwo, ".pagination__item:nth-child(3) .pagination__link")
  elements(:pagination_links, ".pagination__link")
  element(:disclaimer, ".panel-border-wide p")

  def submit(args = {})
    return unless args.key?(:licence)
    find_link(args[:licence]).click
  end

  def search(args = {})
    email_form.set(args[:email_form]) if args.key?(:email_form)
    search_form.set(args[:search_form]) if args.key?(:search_form)
    search_button.click
  end

end
