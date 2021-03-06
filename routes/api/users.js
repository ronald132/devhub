const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

//load input validation
const validateRegisterInput = require('../../validations/register');
const validateLoginInput = require('../../validations/login');

router.get('/test', (req, res) => res.json({msg: 'it works'}));

//@route  POST api/users/register
//@desc   Register user
//@access Public
router.post('/register', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  //check validation
  if(!isValid){
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email })
    .then(user => {
      if(user){
        return res.status(400).json({email: "Email already exists"});
      }else{
        const avatar = gravatar.url(req.body.email, {
          s: '200', //Size
          r: 'pg', //Rating
          d: 'mm' //Default
        });
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          avatar,
          password: req.body.password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;
            newUser.password = hash;
            newUser.save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          })
        });
      }
    });
});

//@route  POST api/users/login
//@desc   User login / Returning JWT Token
//@access Public
router.post('/login', (req, res) => {
  const {errors, isValid} = validateLoginInput(req.body);
  //check validation
  if(!isValid){
    return res.status(400).json(errors);
  }
  
  const email = req.body.email;
  const password = req.body.password;

  //find user by email
  User.findOne({email})
    .then(user => {
      //Check for user
      if(!user){
        return res.status(404).json({email: 'User email not found'});
      }

      //Check password
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if(isMatch){
            const payload = { id: user.id, email: user.email, name: user.name, avatar: user.avatar };
            //assign token
            jwt.sign(payload, keys.secret, {expiresIn: 3600}, (err, token) => {
              res.json({
                success: true,
                token
              });
            });
          }else{
            return res.status(400).json({password: 'Password incorrect'});
          }
        })
    })
});

//@route  POST api/users/current
//@desc   Get current login user
//@access Private
router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  });
});

module.exports = router;