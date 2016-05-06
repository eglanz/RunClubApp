Feature: User can access executive page
  As a logged in user
  I want to be able to view the executives
  
  Scenario: User goes to executives page
    When I go to the url
    When I go to the sign up url
    When I sign up
    When I go to the url
    When I go to the meet the leaders header
    When I go to the run club leadership
    Then I should see "Running Club Leadership"
    