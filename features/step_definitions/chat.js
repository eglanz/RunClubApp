module.exports = function(){
    this.World = require("../support/world.js").World;

    /*this.When(/^I go to the chat header$/, function(callback){
        this.browser.clickLink('Group Chat',callback);
        //this.browser.clickLink('All Routes',callback);
    });*/
    
    this.When(/^I go to the chat url$/, function(callback){
        this.visit('https://runclubapp.herokuapp.com/chat', callback);
    });

};