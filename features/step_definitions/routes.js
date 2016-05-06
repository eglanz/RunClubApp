module.exports = function(){
    this.World = require("../support/world.js").World;

    
    this.Then(/^I should see a view route button$/, function(callback){
        this.expect("View Route").exists;
        callback();
    });
    
    this.Then(/^the page should include "([^"]*)"$/, function(title, callback){
        var pageTitle = this.browser.text('h4');
        this.expect(pageTitle).to.include(title);
        callback();
    });
    
    this.When(/^I click view route button$/, function(callback){
        this.browser.clickLink("View Route", callback);
        //callback();
    });
    
    this.When(/^I go to the create route page$/, function(callback){
        this.browser.clickLink('Create Route', callback);
    });

    this.Then(/^I should see a create route button$/, function(callback){
        this.expect("Create").exists;
        callback();
    });

};