Before do |scenario|
  puts "Before hook"

  if scenario.source_tag_names.include? "@with-test-data"
    puts "Before hook - adding test data"
    @test_data = TestData.new(external_application_url)
    @test_data.set_up
  end
end

After do |scenario|
  puts "After hook"

  if scenario.source_tag_names.include? "@with-test-data"
    puts "After hook - cleaning up test data"
    @test_data.tear_down
  end
end
