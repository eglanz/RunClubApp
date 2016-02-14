module.exports = function(){
    this.World = require("../support/world.js").World;
    
    this.When(/^I go to the url$/, function(callback){
        //var url = encodeURI('https://runclubapp.herokuapp.com');
        this.visit('https://runclubapp.herokuapp.com', callback);
        //this.visit('www.google.com', callback());
    });
    
    this.Then(/^I should see "(.*)"$/, function(title, callback){
        var pageTitle = this.browser.text('h2');
        this.expect(pageTitle).to.equal(title);
        callback();
    });
}