Feature: User can get their milelog and add miles
  As a logged in user
  I want to be able to get my milelog and add my miles
    
  Scenario: User goes to the Add Miles page
    When I go to the url
    When I go to the sign up url
    When I sign up
    When I go to the milelog header
    When I go to the Add Miles page
    Then I should see the Add Miles title
    
  Scenario: User goes to the view Mile Log page
    When I go to the url
    When I go to the sign up url
    When I sign up
    When I go to the milelog header
    When I go to the Mile Log page
    Then I should see the Mile Log title
    
  Scenario: User goes to the Add Miles Page and adds miles to their log
    When I go to the url
    When I go to the sign up url
    When I sign up
    When I go to the milelog header
    When I go to the Add Miles page
    Then I should see the Add Miles title
    When I add miles
    Then I should see the mile view page
    
  Scenario: User goes to the Add Miles Page and adds miles to their log and updates their miles
    When I go to the url
    When I go to the sign up url
    When I sign up
    When I go to the milelog header
    When I go to the Add Miles page
    Then I should see the Add Miles title
    When I add miles
    Then I should see the mile view page
    
    When I click update link
    Then I should see the update title
    When I update the information
    Then I should see the update information
    
    