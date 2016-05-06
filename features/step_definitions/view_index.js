module.exports = function(){
    this.World = require("../support/world.js").World;
    
    this.When(/^I go to the url$/, function(callback){
        this.visit('https://runclubapp.herokuapp.com', callback);
    });
    
    this.When(/^I go to the sign up url$/, function(callback){
        this.browser.click('#signuplink',callback);
    });
    
    
    this.When(/^I sign up$/, function(callback){
      var email = "zener" + Math.random() + "@email.com";
      //console.log(email);
      var username = "user" + Math.random();
      //console.log(username);
      this.browser.fill('input#username', username);
      this.browser.fill('input#firstName', 'Zener');
      this.browser.fill('input#lastName', 'Diode');
      this.browser.fill('input#email', email);
      this.browser.fill('input#password', '123456789sdafadsf0abc092838kddefjklmno');
      this.browser.click('#signing_button', callback);
    });
    
    this.Then(/^I should see "(.*)"$/, function(title, callback){
        //console.log(title + '   ' + callback);
        var pageTitle = this.browser.text('h1');
        this.expect(pageTitle).to.equal(title);
        callback();
    });
};