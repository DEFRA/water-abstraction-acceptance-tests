require "httparty"

class TestData

  def initialize(external_application_url)
    @base_url = external_application_url
  end

  def create_url(path_tail)
    "#{@base_url}acceptance-tests/#{path_tail}"
  end

  def set_up
    url = create_url "set-up"
    puts "Set up request to #{url}"
    response = HTTParty.post url
    @response_data = response.parsed_response

    raise "Could not create test data" unless response.code == 200
  end

  def tear_down
    url = create_url "tear-down"
    puts "Tear down request to #{url}"
    response = HTTParty.post url
    @response_data = nil

    raise "Could not tidy up test data" unless response.code == 200
  end

  def current_licences_with_returns
    @response_data["currentLicencesWithReturns"]
  end

  def current_licence_return(frequency = "daily")
    current_licences_with_returns["returns"][normalize_frequency(frequency)]
  end

  private

    def normalize_frequency(frequency)
      case frequency.downcase
      when "day", "daily"
        return "daily"
      when "week", "weekly"
        return "weekly"
      when "month", "monthly"
        return "monthly"
      end
    end
end
