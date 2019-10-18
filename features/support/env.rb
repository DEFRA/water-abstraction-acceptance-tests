Before do |scenario|
  puts "Before hook"

  use_test_data = scenario.source_tag_names.include? "@use-test-data"
  use_internal_test_data = scenario.source_tag_names.include? "@use-internal-test-data"

  if use_test_data || use_internal_test_data
    puts "Before hook - adding test data"

    @test_data = TestData.new(external_application_url)
    @test_data.create use_internal_test_data
  end
end

After do |scenario|
  puts "After hook"

  use_test_data = scenario.source_tag_names.include? "@use-test-data"
  use_internal_test_data = scenario.source_tag_names.include? "@use-internal-test-data"

  if use_test_data || use_internal_test_data
    puts "After hook - cleaning up test data"
    @test_data.tear_down
  end
end
