Feature: User can get route recommendations
  As a logged in user
  I want to be able to get route recommendations
  
  Background:
    When I go to the url
    When I go to the sign up url
    When I sign up
    
  Scenario: User goes to recommendations page
    When I go to the route header
    When I go to the recommendations page
    Then I should see "Get Route Recommendations"
    
  Scenario: User views like button
    When I go to the route header
    When I go to the all routes page
    Then I should see a like button
    
  Scenario: User clicks like button
    When I go to the route header
    When I go to the all routes page
    When I click like button
    Then I should see an unlike button

    

    