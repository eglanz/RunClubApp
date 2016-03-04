'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Location Schema
 */
var LocationSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  /*lat:{
    type: Number,
    default: 0,
    trim: true
  },
  lon:{
    type: Number,
    default: 0,
    trim: true
  },*/
  name: {
    type: String,
    default: '',
    trim: true
  },
  content: {
    type: String,
    default: '',
    required: 'Route cannot be empty'
  },
  length: {
    type: Number,
    default: 0,
    trim: true
  },
  hills: {
    type: Number,
    default: 0,
    trim: true
  },
  scenic: {
    type: Number,
    default: 0,
    trim: true
  },
  traffic: {
    type: Number,
    default: 0,
    trim: true
  },
  overall: {
    type: Number,
    default: 0,
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Location', LocationSchema);

