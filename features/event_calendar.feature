Feature: User can view a calendar of events and sign up for the events, admin can add events to that calendar
  Background:
    When I go to the url
    When I go to the sign up url
    When I sign up
    #When I navigate to "Create Event"
    #Given an event called "My Event" has been added to the calendar
    #When I go to the url
  
  Scenario: User navigates to List Events page
    When I navigate to "List Events"
    Then I should see a calendar
    
  Scenario: User can view an event
    Given I navigate to "List Events"
    When I click on an event
    Then I should see an event page
    
  Scenario: User can sign up for an event
    Given I navigate to "List Events"
    When I click on an event
    When I click on "Sign Me Up!"
    Then I should be signed up for that event
    
  Scenario: User can opt out of an event after signing up
    Given I navigate to "List Events"
    When I click on an event
    When I click on "Sign Me Up!"
    And I click on "I No Longer Want To Participate"
    Then I should not be signed up for that event