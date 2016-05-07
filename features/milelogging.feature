Feature: User can get their milelog and add miles
  As a logged in user
  I want to be able to get my milelog and add my miles
  Background:
    When I go to the url
    When I go to the sign up url
    When I sign up
    When I go to the url
    
  Scenario: User goes to the Add Miles page
    When I go to the milelog header
    When I go to the Add Miles page
    Then I should see the Add Miles title
    
  Scenario: User goes to the view Mile Log page
    #When I go to the url
    #When I go to the milelog header
    #When I go to the Mile Log page
    #Then I should see the Mile Log title
    
    
    