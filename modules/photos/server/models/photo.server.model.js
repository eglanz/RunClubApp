'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Photo Schema
 */
var PhotoSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  content: {
    type: String,
    default: '',
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  ImageURL: {
    type: String,
    default: 'modules/photos/client/img/default.png'
  }
});

var PhotoModel = mongoose.model('Photo', PhotoSchema);

/*PhotoSchema.pre('save', function (next) {
  var self = this;
  if(this.isNew === false)
  {
    next();
  }
  else
  {
    PhotoModel.find({ ImageURL : self.ImageURL }, function (err, docs) {
      if (!docs.length){
        next();
      }else{          
        next(new Error('image name already exists'));
      }
    });
  }
});*/