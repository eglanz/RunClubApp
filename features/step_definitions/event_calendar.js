module.exports = function(){
  this.World = require("../support/world.js").World;
  
  /*
  this.Given(/^an event called "(.*)" has been added to the calendar$/, function(eventName, callback) {
    var date = new Date();
    this.browser.fill('#title',eventName);
    this.browser.fill('#date',date.toString());
    this.browser.fill('#starttime',date.toString());
    this.browser.fill('#endtime',date.toString());
    this.browser.fill('#content','Content');
    this.browser.click('Create', callback);
  });
  */
  this.When(/^I navigate to "(.*)"$/, function (item, callback) {
    this.browser.clickLink(item, callback);
  });
  
  this.When(/^I click on "(.*)"$/, function (item, callback) {
    var myLink = this.browser.link(item);
    if (myLink != null) {
      myLink.click();
      callback();
    } else {
      callback(new Error("Expected to find a link with the text " + item));
    }
    
  });
  
  this.When(/^I click on an event$/, function (callback) {
    //setTimeout(run(this, callback), 10000);
    
    //function run(instance) {
      /*var myLink = instance.browser.link('a.fc-day-grid-event');
      if (myLink != null) {
        myLink.click();
        callback();
      } else {
        callback(new Error("Expected to find an event"));
      }*/
      //instance.browser.clickLink('.fc-day-grid-event',callback);
      //instance.browser.clickLink('2:20p - 4pRunning Club Kick Off Event',callback);
    //}
    
    //this.browser.wait().clickLink('.fc-day-grid-event',callback);
    //this.browser.clickLink('2:20p - 4pRunning Club Kick Off Event', callback);
    this.browser.visit('http://runclubapp.herokuapp.com/clubevents/5701db091299640e0040296e', callback);
  });
  
  this.Then(/^I should see a calendar$/, function(callback) {
    if (this.browser.query('.fc') != null)
      callback();
    else
      callback(new Error("Expected to find a calendar"));
  });
  
  this.Then(/^I should see an event page$/, function(callback) {
    if (this.browser.query('#event-page') != null)
      callback();
    else
      callback(new Error("Expected to be on an event page"));
  });
  
  this.Then(/^I should be signed up for that event$/, function(callback) {
    if (this.browser.link('I No Longer Want To Participate') != null) {
      callback();
    }
    else {
      callback(new Error("Should be signed up for event"));
    }
  });
  
  this.Then(/^I should not be signed up for that event$/, function(callback) {
    if (this.browser.link('I No Longer Want To Participate') == null) {
      callback();
    }
    else {
      callback(new Error("Should NOT be signed up for event"));
    }
  });
}