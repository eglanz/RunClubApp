'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
  
/**
 * Plan Schema
 */
var PlanSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  race: {
    type: String,
    unique: true,
    trim: true,
    required: 'Race Type cannot be empty'
    
  },
  url: {
    type: String,
    default: '',
    required: 'URL cannot be empty'
  }
});

var PlanModel = mongoose.model('Plan', PlanSchema);

/**
 * Hook a pre save method to hash the password
 */

  
  


//});




