Feature: User can get training plans
  As a logged in user
  I want to be able to get training plans
  
  Background:
    When I go to the url
    When I go to the sign up url
    When I sign up
    
  Scenario: User goes to training page
    When I go to the route header
    When I go to the training plans page
    Then I should see "Training Plans"
    

    