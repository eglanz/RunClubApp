'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Article Schema
 */
var ExecutiveSchema = new Schema({
  firstName: {
    type: String,
    default: '',
    trim: true,
    required: 'First Name required'
  },
  lastName: {
    type: String,
    default: '',
    trim: true,
    required: 'Last Name required'
  },
  email: {
    type: String,
    default: '',
    trim: true,
    required: 'Email required'
  },
  descript: {
    type: String,
    default: '',
    trim: true
  }
});

mongoose.model('Executive', ExecutiveSchema);
