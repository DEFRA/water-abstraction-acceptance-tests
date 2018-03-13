# frozen_string_literal: true

require "rubocop/rake_task"

RuboCop::RakeTask.new

task default: :run

# Remember to create an environment variable in Travis (can be set to anything)!
if ENV["TRAVIS"]
  # Setting the default is additive. So if we didn't add the following line
  # :default would now run both all tests and rubocop
  Rake::Task[:default].clear
  task default: [:ci]
end

desc "Run all scenarios (eq to bundle exec quke)"
task :run do
  sh %( QUKE_CONFIG=.config.yml bundle exec quke )
end

desc "Runs the tests used by continuous integration to check the project"
task :ci do
  Rake::Task["rubocop"].invoke
  sh %( QUKE_CONFIG=.config-ci.yml bundle exec quke --tags @ci )
end

# The following is copied from
# https://github.com/DEFRA/waste-carriers-acceptance-tests/blob/master/Rakefile
#
# To run Browserstack tests, use bundle exec rake bs

desc "Run all browser tests"
task bs: %i[ios_safari ios_chrome android_chrome winphone_ie]
# separate browsers with spaces

# rubocop:disable Metrics/LineLength
# Text for task bs: win7_ie9 win7_ie11 win7_chrome win7_ff win10_edge macos_safari macos_chrome macos_ff ios_safari ios_chrome android_chrome samsung winphone_ie
# rubocop:enable Metrics/LineLength

# Browsers from GOV.UK 9Mar18, with latest versions:

# win7_ie9 pass (basic)
# win7_ie11 pass
# win7_chrome (v64) pass
# win7_ff (v58) pass
# win10_edge pass
# macos_safari pass
# macos_chrome (v64) pass
# macos_ff (v58) pass
# ios_safari
# ios_chrome NOT POSSIBLE ON BS - TEST MANUALLY
# android_chrome
# samsung (Galaxy S8) pass
# winphone_ie

desc "Run Windows 7 IE9 test"
task :win7_ie9 do
  sh %( QUKE_CONFIG=.config-bs-win7_ie9.yml bundle exec quke --tags @wip)
end

desc "Run Windows 7 IE11 test"
task :win7_ie11 do
  sh %( QUKE_CONFIG=.config-bs-win7_ie11.yml bundle exec quke --tags @basic)
end

desc "Run Windows 7 Chrome test"
task :win7_chrome do
  sh %( QUKE_CONFIG=.config-bs-win7_chrome.yml bundle exec quke --tags @basic)
end

desc "Run Windows 7 Firefox test"
task :win7_ff do
  sh %( QUKE_CONFIG=.config-bs-win7_ff.yml bundle exec quke --tags @basic)
end

desc "Run Windows 10 Edge test"
task :win10_edge do
  sh %( QUKE_CONFIG=.config-bs-win10_edge.yml bundle exec quke --tags @basic)
end

desc "Run Mac Safari test"
task :macos_safari do
  sh %( QUKE_CONFIG=.config-bs-macos_safari.yml bundle exec quke --tags @basic)
end

desc "Run Mac Chrome test"
task :macos_chrome do
  sh %( QUKE_CONFIG=.config-bs-macos_chrome.yml bundle exec quke --tags @basic)
end

desc "Run Mac Firefox test"
task :macos_ff do
  sh %( QUKE_CONFIG=.config-bs-macos_ff.yml bundle exec quke --tags @basic)
end

desc "Run Samsung Galaxy test"
task :samsung do
  sh %( QUKE_CONFIG=.config-bs-samsung.yml bundle exec quke --tags @basic)
end

# Haven't done the rest yet, I want to see if the first one works.
