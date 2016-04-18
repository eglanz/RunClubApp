var zombie = require('zombie');
zombie.waitDuration = '10s';
module.exports = function(){
    this.World = require("../support/world.js").World;

    this.When(/^I go to the milelog header$/, function(callback){
        this.browser.clickLink('Mile Logging',callback);
    });
    
    
    this.When(/^I go to the Add Miles page$/, function(callback){
        this.browser.clickLink('Add Miles', callback);
    });
    
    this.When(/^I should see the Add Miles title$/, function(callback){
        var pageTitle = this.browser.text('h1');
        this.expect(pageTitle).to.equal("New Mile Log Entry");
        callback();
    });
    
    /*this.When(/^I go to the Mile Log page$/, function(callback){
        this.browser.clickLink('Mile Log', callback);
        
    });*/
    
    this.When(/^I add miles$/, function(callback){
      this.browser.fill('input#length', 5);
      this.browser.fill('input#date', Date.now());
      console.log('i add miles');
      //this.browser.click('button#submit','submit', callback);
      this.browser.click('.btn', callback);
    });
    
    /*this.Then(/^I should see the mile view page$/, function(callback){
        zombie.waitDuration = "30s";
        var pageTitle = this.browser.text('h1');
        var val = (pageTitle === 'New Mile Log Entry');
        //this.expect(pageTitle).to.notEqual('New Mile Log Entry', callback);
        this.expect(val).to.equal(false);
        callback();
    });*/
    
    this.Then(/^I should see the update title$/, function(callback){
        var pageTitle = this.browser.text('h1');
        this.expect(pageTitle).to.equal('Edit Mile Log Entry');
        callback();
    });
    
   /* this.When(/^I click update link$/, function(callback){
        this.browser.click('.btn-default', callback);
    });*/
    
    /*this.When(/^I update the information$/, function(callback){
      this.browser.fill('input#length', 5);
      this.browser.fill('input#date', Date.now());
      this.browser.click('.btn', callback);
    });*/
    
    

};