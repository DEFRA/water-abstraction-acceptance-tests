require "httparty"

class TestData

  def initialize(external_application_url)
    @base_url = external_application_url
  end

  def create(include_internal = false)
    url = create_url "set-up"
    puts "Set up request to #{url}, include_internal=#{include_internal}"
    response = HTTParty.post(url, body: { includeInternalUsers: include_internal })
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

  # If internal users have been requested then the response will contain a
  # sub object of users with differing roles. They may be:
  #
  # - super
  # - wirs
  # - nps
  # - nps with digitise
  # - nps with digitise approval
  # - environment_officer
  # - billing_and_data
  # - psc
  def internal_users
    @response_data["internalUsers"]
  end

  # If agent users have been requested then the response will contain a
  # sub object of agents.
  #
  # - agent (agent who cannot see returns)
  # - agentWithReturns (agent who can see returns)
  def agents
    @response_data["agents"]
  end

  def current_licence_return(frequency = "daily")
    current_licences_with_returns["returns"][normalize_frequency(frequency)]
  end

  def password
    Quke::Quke.config.custom["data"]["accounts"]["test_data_password"]
  end

  private

  def normalize_frequency(frequency)
    case frequency.downcase
    when "day", "daily"
      "daily"
    when "week", "weekly"
      "weekly"
    when "month", "monthly"
      "monthly"
    end
  end

  def create_url(path_tail)
    "#{@base_url}acceptance-tests/#{path_tail}"
  end
end
