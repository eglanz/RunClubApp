Feature: User can access group chat
  As a logged in user
  I want to be able to view the group chat
  
  Scenario: User goes to recommendations page
    When I go to the url
    When I go to the sign up url
    When I sign up
    When I go to the chat header
    Then I should see "Group Chat"
    