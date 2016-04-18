Feature: User can view routes
  As a logged in user
  I want to be able to see routes
    
  Scenario: User views all routes
    When I go to the url
    When I go to the sign up url
    When I sign up
    When I go to the route header
    When I go to the all routes page
    Then I should see "Routes"
    
  Scenario: User sees the view route button
    When I go to the url
    When I go to the sign up url
    When I sign up
    When I go to the route header
    When I go to the all routes page
    Then I should see a view route button
    
  Scenario: User clicks the view route button
    When I go to the url
    When I go to the sign up url
    When I sign up
    When I go to the route header
    When I go to the all routes page
    When I click view route button
    Then the page should include "Click on map to change start point."
    
  Scenario: User clicks on create route
    When I go to the url
    When I go to the sign up url
    When I sign up
    When I go to the route header
    When I go to the create route page
    Then I should see a create route button
    
