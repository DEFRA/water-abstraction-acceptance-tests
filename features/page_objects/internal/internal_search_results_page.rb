# rubocop:disable Naming/PredicateName
class InternalSearchResultsPage < SitePrism::Page
  def has_link_to_searched_return?
    find("table a", text: "10025511")
  end

  def has_pagination_details?
    find("p.pagination__current-page", text: /Page \d* of \d*/)
  end

  def has_link_to_next_page_of_results?
    find(".pagination__next .pagination__link", text: "Next page")
  end
end
# rubocop:enable Naming/PredicateName
