Feature: User can get route recommendations
  As a logged in user
  I want to be able to get route recommendations
    
  Scenario: User goes to recommendations page
    When I go to the url
    When I go to the sign up url
    When I sign up
    When I go to the route header
    When I go to the recommendations page
    Then I should see "Get Route Recommendations"

    

    