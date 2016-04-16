module.exports = function(){
    this.World = require("../support/world.js").World;

    this.When(/^I go to the chat header$/, function(callback){
        this.browser.clickLink('Group Chat',callback);
    });

}