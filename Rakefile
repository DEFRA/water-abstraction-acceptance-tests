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

desc "Reset data in the environment"
# Run this if the
task :reset do
  sh %( bundle exec quke --tags @reset)
end

desc "Run basic features"
task :basic do
  sh %( bundle exec quke --tags @basic)
end

# Default task
desc "Run main features without refreshing the environment"
task :test do
  sh %( bundle exec quke --tags @digitise)
  sh %( bundle exec quke --tags @flow)
  sh %( bundle exec quke --tags @notify)
  sh %( bundle exec quke --tags @password)
  sh %( bundle exec quke --tags @register)
  sh %( bundle exec quke --tags @rename)
  sh %( bundle exec quke --tags @returns)
  sh %( bundle exec quke --tags @search)
end

# Run this on preprod and prod
desc "Run features which work in the preproduction environment"
task :preprod do
  sh %( bundle exec quke --tags @preprod)
end

desc "Run features suitable for the production environment"
task :prod do
  sh %( bundle exec quke --tags @prod)
end

desc "Run work in progress features"
task :wip do
  sh %( bundle exec quke --tags @wip)
end

desc "Run all features (eq to bundle exec quke), resetting the environment first"
task :reset_run do
  sh %( bundle exec quke --tags @reset)
  sh %( bundle exec quke --tags ~@reset)
end

desc "Run all features with a report"
task :run_report do
  sh %( bundle exec quke --tags ~@reset --profile json_report --profile junit_report --profile html_report)
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
# rubocop:disable Metrics/LineLength
task bs: %i[win7_ie9 win7_ie11 win7_chrome win7_ff win10_edge macos_safari macos_chrome macos_ff ios_safari android_chrome samsung]
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
