module.exports = function(){
    this.World = require("../support/world.js").World;

    this.When(/^I go to the meet the leaders header$/, function(callback){
        this.browser.clickLink('Meet the Board',callback);
    });
    
    this.When(/^I go to the run club leadership$/, function(callback){
        this.browser.clickLink('Run Club Leadership',callback);
    });

}