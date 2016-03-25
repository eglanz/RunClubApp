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
  name: {
    type: String,
    unique: true,
    trim: true,
    required: 'Name cannot be empty'
    
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
  },
  users: [],
  isLiked :{
    type: Boolean,
    default: false
  }
});

var LocationModel = mongoose.model('Location', LocationSchema);

/**
 * Hook a pre save method to hash the password
 */
LocationSchema.pre('save', function (next) {
  var self = this;
  LocationModel.find({name : self.name}, function (err, docs) {
    if (!docs.length){
      next();
    }else{                
      next(new Error('route name already exists'));
      }
    });
});




