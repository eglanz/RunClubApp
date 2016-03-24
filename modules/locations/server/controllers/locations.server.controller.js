'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Location = mongoose.model('Location'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

var fs = require('fs');
/**
 * Create an location
 */
exports.create = function (req, res) {
  var location = new Location(req.body);
  location.user = req.user;

  location.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(location);
    }
  });
};

/**
 * Show the current location
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var location = req.location ? req.location.toJSON() : {};

  // Add a custom field to the Location, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Location model.
  location.isCurrentUserOwner = req.user && location.user && location.user._id.toString() === req.user._id.toString() ? true : false;

  res.json(location);
};

/**
 * Update an location
 */
exports.update = function (req, res) {
  var location = req.location;

  location.title = req.body.title;
  location.content = req.body.content;

  location.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(location);
    }
  });
};

/**
 * Delete an location
 */
exports.delete = function (req, res) {
  var location = req.location;

  location.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(location);
    }
  });
};

/**
 * List of Locations
 */
exports.list = function (req, res) {
  Location.find().sort('-created').populate('user', 'displayName').exec(function (err, locations) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(locations);
    }
  });
};


//JAR STUFF:
exports.jar = function(req, res){
  var locations;
  if(req.params.miles == 0 || req.params.miles == '0'){
    locations = Location.where('length').gt(0).lt(2.99).select('name hills scenic traffic overall');
  }else if(req.params.miles == 1 || req.params.miles == '1'){
    locations = Location.where('length').gt(2.99).lt(5.99).select('name hills scenic traffic overall');
  }else if(req.params.miles == 2 || req.params.miles == '2'){
    locations = Location.where('length').gt(5.99).select('name hills scenic traffic overall');
  }

  var foundLocations = "Id,Hills,Scenic,Traffic,Overall\n";
  var foundLocation;
  locations.exec(function (err, docs) {
  // called when the `query.complete` or `query.error` are called
  // internally

    for(var it in docs){
      foundLocations += docs[it].name+','+docs[it].hills+','+docs[it].scenic+','+docs[it].traffic+','+docs[it].overall+'\n';
    }
    
    var file = "TrainTest.csv";

    var foundLocation;
  
    fs.writeFileSync(file, foundLocations, 'utf8', (err) => {
      if (err) throw err;
      console.log('It\'s saved!');
    });
    
    var file2 = "TestTest.csv";
    foundLocation = "Id,Hills,Scenic,Traffic,Overall\n";
    foundLocation += req.user.firstName+','+req.user.hills+','+req.user.scenic+','+req.user.traffic+','+req.user.overall+'\n';
    console.log("USER:\n"+foundLocation);
    fs.writeFileSync(file2, foundLocation, 'utf8', (err) => {
      if (err) throw err;
      console.log('It\'s saved!');
    });
    
  });

  
  var exec = require('child_process').exec;
  var child = exec('java -jar RunClubRec.jar TrainTest.csv TestTest.csv',
    function (error, stdout, stderr){
      var output = "";
  var outputJson = [];
      console.log('Output -> ' + stdout);
      output += stdout;
      
      if(error !== null){
        console.log("Error -> "+error);
      }

      
      var array_output = output.split('\n');

      var promise = new Promise(function(resolve, reject) {      
      if(array_output.length >= 1){
        Location.findOne({'name' : array_output[0]}).populate('user', 'displayName').exec(function(err,loc){
            if(loc != null){
            outputJson.push(loc);
           }
          
        });
      }
     
      resolve("Resolved");
      });
      
      promise.then(function(result) {
        if(array_output.length >= 2){
        return Location.findOne({'name' : array_output[1]}).populate('user', 'displayName').exec(function(err,loc){
            if(loc != null){
            outputJson.push(loc);
            }
          
        });
      }
      }).then(function(){
          if(array_output.length >= 3){
        return Location.findOne({'name' : array_output[2]}).populate('user', 'displayName').exec(function(err,loc){
            if(loc != null){
            outputJson.push(loc);
            }
          
        });
      }
      }).then(function(){
        if(array_output.length >= 4){
        return Location.findOne({'name' : array_output[3]}).populate('user', 'displayName').exec(function(err,loc){
            if(loc != null){
            outputJson.push(loc);
           }
          
        });
      }
      }).then(function(){
        if(array_output.length >= 5){
       return Location.findOne({'name' : array_output[4]}).populate('user', 'displayName').exec(function(err,loc){
           if(loc != null){
            outputJson.push(loc);
            }
          
        });
      }
      }).then(function(){
          var locations = JSON.stringify(outputJson);
          res.json(outputJson);
      });

      
  });
  
  
  
}

/**
 * Location middleware
 */
exports.locationByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Location is invalid'
    });
  }

  Location.findById(id).populate('user', 'displayName').exec(function (err, location) {
    if (err) {
      return next(err);
    } else if (!location) {
      return res.status(404).send({
        message: 'No location with that identifier has been found'
      });
    }
    req.location = location;
    next();
  });
};

