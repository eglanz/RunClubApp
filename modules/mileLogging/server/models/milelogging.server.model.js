'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Milelogging Schema
 */
var MileloggingSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  length: {
    type: Number,
    default: 0,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Milelogging', MileloggingSchema);
