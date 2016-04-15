module.exports = function(){
    this.World = require("../support/world.js").World;
    
    this.When(/^I go to the url$/, function(callback){
        this.visit('https://runclubapp.herokuapp.com', callback);
    });
    
    this.When(/^I go to the sign up url$/, function(callback){
        this.browser.click('#signuplink',callback);
    });
    
    
    this.When(/^I sign up$/, function(callback){
        //this.browser.setValue('input#username', 'user', callback);
        //this.browser.setValue('input#username', 'user');
        this.browser.window.setValue('#input#username', 'user');
      //setValue('input#username', 'user'+Math.random()).
      /*setValue('input#firstName', 'Zener').
      setValue('input#lastName', 'Diode').
      setValue('input#email', 'zener@email.com').
      setValue('input#password', '1234567890abcdefjklmno').
      submitForm('#userForm')
      .call(callback)*/
    });
    
    this.Then(/^I should see "(.*)"$/, function(title, callback){
        var pageTitle = this.browser.text('h1');
        this.expect(pageTitle).to.equal(title);
        callback();
    });
}