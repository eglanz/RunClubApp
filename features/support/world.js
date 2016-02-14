'use strict';

var chai, chaiAsPromised;
chai = require('chai');
chaiAsPromised = require('chai-as-promised');
var expect = require('chai').expect;



var zombie = require('zombie');
var World = function World(){
    
    //Set up more config as we write app
    this.browser = new zombie();
    this.visit = function(url, callback){
        this.browser.visit(url, callback);
    };
    
    chai.use(chaiAsPromised);
    this.expect = chai.expect;
    //callback();
    
};

module.exports.World = World;