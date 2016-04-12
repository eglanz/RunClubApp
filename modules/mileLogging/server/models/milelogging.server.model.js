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
  title: {
    type: String,
    default: 'miles',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  length: {
    type: Number,
    default: 0,
    trim: true,
    required: 'Please enter your miles.'
  },
  date: {
    type: Date,
    required: 'Please enter a date.',
    default: Date.now
  },
  allDay: {
    type: Boolean,
    default: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Milelogging', MileloggingSchema);

MileloggingSchema.pre('save', function (next) {
  var self = this;
  self.title = self.length.toString() + ' miles';
  next();
});
