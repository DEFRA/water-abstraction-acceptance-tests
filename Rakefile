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
  sh %( bundle exec quke )
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
task bs: %i[ios_safari android_chrome samsung]

# rubocop:disable Metrics/LineLength
# Select browsers from the following, separated by spaces: win7_ie9 win7_ie11 win7_chrome win7_ff win10_edge macos_safari macos_chrome macos_ff ios_safari android_chrome samsung
# rubocop:enable Metrics/LineLength
# Current versions are Chrome 64 and Firefox 58.
# The following browsers are not currently supported by Browserstack and need to be tested manually:
# iOS Chrome and Windows Phone with IE

desc "Run Windows 7 IE9 test"
task :win7_ie9 do
  sh %( QUKE_CONFIG=.config-bs-win7_ie9.yml bundle exec quke --tags @bs)
end

desc "Run Windows 7 IE11 test"
task :win7_ie11 do
  sh %( QUKE_CONFIG=.config-bs-win7_ie11.yml bundle exec quke --tags @bs)
end

desc "Run Windows 7 Chrome test"
task :win7_chrome do
  sh %( QUKE_CONFIG=.config-bs-win7_chrome.yml bundle exec quke --tags @bs)
end

desc "Run Windows 7 Firefox test"
task :win7_ff do
  sh %( QUKE_CONFIG=.config-bs-win7_ff.yml bundle exec quke --tags @bs)
end

desc "Run Windows 10 Edge test"
task :win10_edge do
  sh %( QUKE_CONFIG=.config-bs-win10_edge.yml bundle exec quke --tags @bs)
end

desc "Run Mac Safari test"
task :macos_safari do
  sh %( QUKE_CONFIG=.config-bs-macos_safari.yml bundle exec quke --tags @bs)
end

desc "Run Mac Chrome test"
task :macos_chrome do
  sh %( QUKE_CONFIG=.config-bs-macos_chrome.yml bundle exec quke --tags @bs)
end

desc "Run Mac Firefox test"
task :macos_ff do
  sh %( QUKE_CONFIG=.config-bs-macos_ff.yml bundle exec quke --tags @bs)
end

desc "Run Android Chrome test"
task :android_chrome do
  sh %( QUKE_CONFIG=.config-bs-android_chrome.yml bundle exec quke --tags @bs)
end

desc "Run Samsung test"
task :samsung do
  sh %( QUKE_CONFIG=.config-bs-samsung.yml bundle exec quke --tags @bs)
end

desc "Run iOS Safari test"
task :ios_safari do
  sh %( QUKE_CONFIG=.config-bs-ios_safari.yml bundle exec quke --tags @bs)
end
