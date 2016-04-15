module.exports = function(){
    this.World = require("../support/world.js").World;

    this.When(/^I go to the route header$/, function(callback){
        this.browser.clickLink('Routes',callback);
    });
    
    
    this.When(/^I go to the recommendations page$/, function(callback){
        this.browser.clickLink('Get Route Recommendation', callback);
    });
    
    this.When(/^I click for six or more miles$/, function(callback){
        this.browser.clickLink('6+ miles', callback);
    });
    
    

}