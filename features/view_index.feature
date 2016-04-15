Feature: User can view index page
  As a user
  I want to be able to view the index page
  
  Scenario: User navigates to index page
    When I go to the url
    Then I should see "Welcome to RunNet"
    
  Scenario: User sign up
    When I go to the url
    When I go to the sign up url
    When I sign up
    Then I should see "Welcome to RunNet"
    