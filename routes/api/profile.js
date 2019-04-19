const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//load profile models
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const validateProfileInput = require('../../validations/profile');
router.get('/test', (req, res) => res.json({msg: 'it works'}));


//@route  GET api/profile
//@desc   Get current user profile
//@access Private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};

  Profile.findOne({user: req.user.id})
    .populate('user', ['name','avatar'])
    .then(profile => {
      if(!profile){
        errors.noprofile = 'There is no profile for this user';
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(400).json(err));
});

//@route  POST api/profile
//@desc   Create profile
//@access Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const {errors, isValid} = validateProfileInput(req.body);
  if(!isValid){
    return res.status(400).json(errors);
  }
  
  //Get fields
  const profileFields = {};
  profileFields.user = req.user.id;
  if(req.body.handle) profileFields.handle = req.body.handle;
  if(req.body.company) profileFields.company = req.body.company;
  if(req.body.website) profileFields.website = req.body.website;
  if(req.body.location) profileFields.location = req.body.location;
  if(req.body.bio) profileFields.bio = req.body.bio;
  if(req.body.status) profileFields.status = req.body.status;
  if(req.body.githubusername) profileFields.githubusername = req.body.githubusername;

  //skils - split into array
  if(typeof req.body.skills !== 'undefined') {
    profileFields.skills = req.body.skills.split(',');
  }

  //social
  profileFields.social = {};
  if(req.body.youtube) profileFields.social.youtube = req.body.youtube;
  if(req.body.facebook) profileFields.social.facebook = req.body.facebook;
  if(req.body.twiter) profileFields.social.twiter = req.body.twiter;
  if(req.body.instagram) profileFields.social.instagram = req.body.instagram;
  if(req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;

  Profile.findOne({user: req.user.id})
    .then(profile => {
      if(profile){
        //update
        Profile.findOneAndUpdate({user: req.user.id}, {$set: profileFields}, {new: true}).then(profile => res.json(profile));
      }else{
        //create
        //check if handle exists
        Profile.findOne({ handle: profileFields.handle })
          .then(profile => {
            if(profile){
              errors.handle = 'That handle already exists';
              return res.status(400).json(errors);
            }

            new Profile(profileFields).save().then(profile => res.json(profile));
          });
      }
    });
});

module.exports = router;