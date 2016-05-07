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
    
    this.Then(/^I should see the Mile Log title$/, function (callback) {
      var pageTitle = this.browser.test('h1');
      this.expect(pageTitle).to.equal("Mile Log");
      callback();
    });
    
    this.When(/^I go to the Mile Log page$/, function (callback) {
      this.browser.clickLink('Mile Log', callback);
    });
    
};