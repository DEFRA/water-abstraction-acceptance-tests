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
def click_url_text(elements, search_val)
  # Find the first instance of an element containing the search term and click the link:
  elements.find { |chk| chk["href"].include?(search_val) }.click
end

def production?
  @environment = config_environment
  return true if @environment == "prod" || @environment == "prod2"

  false
end

def config_environment
  Quke::Quke.config.custom["environment"].to_s
end

# Takes the URLS found in the config.yml file and presents the
# data in a hash per application.
#
# - external water resources
# - internal admin
# - developer admin
def config_urls
  urls = Quke::Quke.config.custom["urls"][config_environment]

  {
    external: {
      root: urls["root_url"],
      welcome: urls["front_office"],
      sign_in: urls["front_office_sign_in"]
    },
    internal: {
      root: urls["back_office_internal_root"],
      sign_in: urls["back_office_internal"]
    },
    developer: {
      login: urls["back_office_login"]
    }
  }
end

def external_url(key)
  config_urls[:external][key]
end

def internal_url(key)
  config_urls[:internal][key]
end

def developer_url(key)
  config_urls[:developer][key]
end

def external_application_url
  urls = Quke::Quke.config.custom["urls"][config_environment]
  urls["external_application"]
end

def internal_application_url
  urls = Quke::Quke.config.custom["urls"][config_environment]
  urls["internal_application"]
end

def config_accounts(key)
  Quke::Quke.config.custom["data"]["accounts"][key]
end
