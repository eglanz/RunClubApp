module.exports = function(){
    this.World = require("../support/world.js").World;
    
    this.When(/^I go to the training plans page$/, function(callback){
        this.browser.clickLink('Training Plans', callback);
    });
    
}