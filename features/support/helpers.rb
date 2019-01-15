# Scroll to any element/section
# @param element [Capybara::Node::Element, SitePrism::Section]
def scroll_to(element)
  element = element.root_element if element.respond_to?(:root_element)
  Capybara.evaluate_script <<-SCRIPT
       function() {
         var element = document.evaluate('#{element.path}', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
         window.scrollTo(0, element.getBoundingClientRect().top + pageYOffset - 200);
       }();
     SCRIPT
end

# Function to click the first element where link text includes search_val
def click_url_text(element, search_val)
  # Find the first instance of an element containing the search term and click the link:
  element.find { |chk| chk["href"].include?(search_val) }.click
end

def production?
  @environment = Quke::Quke.config.custom["environment"].to_s
  return true if @environment == "prod"
  false
end
