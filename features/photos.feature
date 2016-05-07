Feature: User can view photos
  As a logged in user
  I want to be able to see photos
  Background:
    When I go to the url
    When I go to the sign up url
    When I sign up
    When I go to the url
    
  Scenario: User views all photos
    When I go to the photos page
    Then I should see "Club Photos"
    
  Scenario: User clicks on add photo
    #When I go to the add photo page
    #Then I should see a create route button
    
