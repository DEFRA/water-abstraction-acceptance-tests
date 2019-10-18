Before do |scenario|
  puts "Before hook"

  if scenario.source_tag_names & %w[@use-test-data @use-internal-test-data]
    puts "Before hook - adding test data"
    include_internal = scenario.source_tag_names.include? "@use-internal-test-data"
    @test_data = TestData.new(external_application_url)
    @test_data.create include_internal
  end
end

After do |scenario|
  puts "After hook"

  if scenario.source_tag_names & %w[@use-test-data @use-internal-test-data]
    puts "After hook - cleaning up test data"
    @test_data.tear_down
  end
end
