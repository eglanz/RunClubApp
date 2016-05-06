module.exports = function(){
    this.World = require("../support/world.js").World;

    this.When(/^I go to the route header$/, function(callback){
        this.browser.clickLink('Routes',callback);
    });
    
    
    this.When(/^I go to the recommendations page$/, function(callback){
        this.browser.clickLink('Get Route Recommendation', callback);
    });
    
    this.When(/^I go to the all routes page$/, function(callback){
        this.browser.clickLink('All Routes', callback);
    });
    
    this.Then(/^I should see a like button$/, function(callback){
        this.expect("Like Route").exists;
        callback();
    });
    
    this.Then(/^I should see an unlike button$/, function(callback){
        this.expect("Unlike Route").exists;
        callback();
    });
    
    this.When(/^I click like button$/, function(callback){
        this.browser.clickLink("Like Route", callback);
        //callback();
    });
    
    this.When(/^I click for six or more miles$/, function(callback){
        this.browser.clickLink('6+ miles', callback);
    });

};