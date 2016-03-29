'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Clubevent Schema
 */
var ClubeventSchema = new Schema({
  title: {
    type: String,
    default: '',
    required: 'Please fill event title',
    trim: true
  },
  content: {
    type: String,
    default: '',
    trim: true
  },
  start: {
    type: Date,
    default: Date.now
  },
  end: {
    type: Date,
    default: Date.now
  },
  allDay: {
    type: Boolean,
    default: false
  },
  url: {
    type: String,
    default: null
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
  // TODO: route data for events that involve running routes (foreign keys),
  //       default to null, maybe include links to route pages instead?
});

mongoose.model('Clubevent', ClubeventSchema);
