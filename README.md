# Water abstraction acceptance tests

[![Build Status](https://travis-ci.org/DEFRA/water-abstraction-acceptance-tests.svg?branch=master)](https://travis-ci.org/DEFRA/water-abstraction-acceptance-tests)
[![security](https://hakiri.io/github/DEFRA/water-abstraction-acceptance-tests/master.svg)](https://hakiri.io/github/DEFRA/water-abstraction-acceptance-tests/master)
[![Dependency Status](https://dependencyci.com/github/DEFRA/water-abstraction-acceptance-tests/badge)](https://dependencyci.com/github/DEFRA/water-abstraction-acceptance-tests)

This project contains the acceptance tests for the Water abstraction digital service. It is built around [Quke](https://github.com/DEFRA/quke), a Ruby gem that simplifies the process of writing and running Cucumber acceptance tests.

## Pre-requisites

This project is setup to run against version 2.3.0 of Ruby.

The rest of the pre-requisites are the same as those for [Quke](https://github.com/DEFRA/quke#pre-requisites).

## Installation

First clone the repository and then drop into your new local repo

```bash
git clone https://github.com/DEFRA/water-abstraction-acceptance-tests.git && cd water-abstraction-acceptance-tests
```

To help with installing dependencies on a Mac, the following tools are useful:

|Tool|What it does|How to use|
|----|------------|-------|
|Homebrew|Make it easy to install Mac packages|[Installation instructions](https://brew.sh/)|
|rbenv|Manage Ruby versions|`brew install rbenv`|
||To install Ruby, use:|`rbenv install 2.3.0`|
||To set Ruby version, use:|`rbenv global 2.3.0`|
||To initialise Ruby, use:|`rbenv init`|
|Bundler|Use the correct components for your repository|`sudo gem install bundler`|

Next download and install the dependencies

```bash
bundle install
```

## Configuration

You can figure how the project runs using [Quke config files](https://github.com/DEFRA/quke#configuration). Before executing this project for the first time you'll need to create an initial `.config.yml` file.

```bash
touch .config.yml
```

Into that file you'll need to add as a minimum this

```yaml
# Capybara will attempt to find an element for a period of time, rather than
# immediately failing because the element cannot be found. This defaults to 2
# seconds but with the need to confirm emails via mailinator, we have found we
# need to increase this time to at least 5 seconds
max_wait_time: 5

custom:
  accounts:
    agency_user:
      username: agency_user@example.gov.uk
      password: Password1234
    finance_admin:
      username: finance_admin@example.gov.uk
      password: Password1234
    finance_basic:
      username: finance_basic@example.gov.uk
      password: Password1234
    agency_user_with_payment_refund:
      username: agency_user_with_payment_refund@example.gov.uk
      password: Password1234
  urls:
    front_office: "http://domainundertest.gov.uk/registrations/start"
    front_office_sign_in: "http://domainundertest.gov.uk/users/sign_in?locale=en"
    back_office: "http://domainundertest.gov.uk/agency_users/sign_in"
    back_office_admin: "http://domainundertest.gov.uk/admins/sign_in"
    mail_checker: "https://www.mailinator.com"
```

If left as that by default when **Quke** is executed it will run against your selected environment using the headless browser **PhantomJS**. You can however override this and other values using the standard [Quke configuration options](https://github.com/DEFRA/quke#configuration).

## Execution

To run all scenarios call

```bash
bundle exec quke
```

You can also enter the following commands (from the Rakefile) to carry out the following tasks:

Reset the data in the environment:
```bash
bundle exec rake reset
```

Run the main test scenarios (excluding reset and basic tests)
```bash
bundle exec rake test
```

Run only steps for preproduction:
```bash
bundle exec rake preprod
```

Run only basic steps:
```bash
bundle exec rake basic
```

You can create [multiple config files](https://github.com/DEFRA/quke#multiple-configs), for example you may wish to have one setup for running against **Chrome**, and another to run against a different environment. You can tell **Quke** which config file to use by adding an environment variable argument to the command.

```bash
QUKE_CONFIG='chrome.config.yml' bundle exec quke
```

## Use of tags

[Cucumber](https://cucumber.io/) has an inbuilt feature called [tags](https://github.com/cucumber/cucumber/wiki/Tags).

These can be added to a [feature](https://github.com/cucumber/cucumber/wiki/Feature-Introduction) or individual **scenarios**.

```gherkin
@frontoffice
Feature: Validations within the digital service
```

```gherkin
@frontoffice @happypath
Scenario: Registration by an individual
```

When applied you then have the ability to filter which tests will be used during any given run

```bash
bundle exec quke --tags @preprod # Run only things tagged with this
bundle exec quke --tags @preprod,@wip # Run all things with these tags
bundle exec quke --tags ~@returns # Don't run anything with this tag (run everything else)
```

### In this project

To have consistency across the project the following tags are defined and should be used in the following ways

|Tag|Description|
|---|---|
|@reset|Refreshes the data in the test environment. Only needs to be run if external_user steps are failing.|
|@basic|Features used for basic regression testing as part of Continuous Integration|
|@test|The core test suite, including writing to the database.  Do not run this in production.|
|@preprod|Any feature which can be run on preproduction.|
|@prod|Any feature which can be run on production.|
|@ci|A feature that is intended to be run only on our continuous integration service (you should never need to use this tag).|
|@(test name)|Run an individual feature: @digitise, @flow, @password, @notify, @register, @rename, @returns, @search, @switch|

It's also common practice to use a custom tag whilst working on a new feature or scenario e.g. `@focus` or `@wip`. That is perfectly acceptable but please ensure they are removed before your change is merged.

## Tips

In our experience one of the most complex and time consuming aspects of creating new features is identifying the right [CSS selector](http://www.w3schools.com/cssref/css_selectors.asp) to use, to pick the HTML element you need to work with.

A tool we have found useful is a Chrome addin called [SelectorGadget](http://selectorgadget.com/).

You can also test them using the Chrome developer tools. Open them up, select the elements tab and then `ctrl/cmd+f`. You should get an input field into which you can enter your selector and confirm/test it's working. See <https://developers.google.com/web/updates/2015/05/search-dom-tree-by-css-selector>

Capybara has a known issue with links that don't have a valid href, as seen in MS dynamics. Work around is to find the element by ID and then call `click()` on it e.g. `page.find("#example-thing-id").click`. Issue details can be found here: https://github.com/teamcapybara/capybara/issues/379

In instances where the element to be interacted with is out of the viewport of the browser it's possible to receive a 'Element is not clickable at point' error message. A scroll_to helper has been added to scroll to the element so it's now visable to be interacted with using scroll_to(element)
Example scroll_to(@front_app.sign_in_page)

## Contributing to this project

If you have an idea you'd like to contribute please log an issue.

All contributions should be submitted via a pull request.

## License

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3

The following attribution statement MUST be cited in your products and applications when using this information.

> Contains public sector information licensed under the Open Government license v3

### About the licence

The Open Government Licence (OGL) was developed by the Controller of Her Majesty's Stationery Office (HMSO) to enable information providers in the public sector to license the use and re-use of their information under a common open licence.

It is designed to encourage use and re-use of information freely and flexibly, with only a few conditions.
