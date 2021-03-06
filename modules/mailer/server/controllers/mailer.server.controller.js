'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  nodemailer = require('nodemailer'),
  config = require('../../../../config/config'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));


var smtpTransport = nodemailer.createTransport(config.mailer.options);

/**
 * Create mass mail
 */
exports.massMailer = function(req,res) {
  // gather list of users that want to receive mass emails (their doNotEmail boolean is false)
  User.find({ doNotEmail: false }).exec(function (err, users) { 
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      // send mail content to all users that want to receive mass emails
      var email = {
        from: req.user.email,
        subject: req.body.subject,
        text: req.body.content
      };
        
      for (var i = 0; i < users.length; i++) {
        if (users[i].email !== 'admin@localhost.com' && users[i].email !== 'user@localhost.com') {
          if (req.body.onlyAdminsToggle === false || (req.body.onlyAdminsToggle === true && users[i].roles.indexOf('admin') !== -1)) {
            email.to = users[i].email;
            smtpTransport.sendMail(email, emailCallback());
          }
        }
      }
      res.json(1); // success
    }
  });
};

function emailCallback() {
  return function(error,info) {
    if(error){
      return console.log(error);
    }
    console.log('Message sent: ' + info.response);
  };
}