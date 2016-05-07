module.exports = function(){
    this.World = require("../support/world.js").World;
    
    this.When(/^I go to the club photos header$/, function(callback){
        this.browser.clickLink('Club Photos', callback);
    });
    
    this.When(/^I go to the photos page$/, function(callback){
        this.browser.clickLink('Photos', callback);
        //this.visit('https://runclubapp.herokuapp.com/photos', callback);
    });
    
    this.When(/^I go to the add photo page$/, function(callback){
        //this.browser.clickLink('Add Photo', callback);
        this.visit('https://runclubapp.herokuapp.com/photos/create', callback);
    });

   /* this.Then(/^I should see a create route button$/, function(callback){
        this.expect("Create").exists;
        callback();
    });*/

};