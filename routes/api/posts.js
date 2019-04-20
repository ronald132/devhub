const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//models
const Post = require('../../models/Post');

//validation
const validatePostInput = require('../../validations/post');

router.get('/test', (req, res) => res.json({msg: 'it works'}));

//@route  GET api/posts
//@desc   get posts
//@access Public
router.get('/', (req, res) => {
  Post.find().sort({date: -1})
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({nopostfound: 'No posts found'}));
});

//@route  GET api/posts/:id
//@desc   get single post by id
//@access Public
router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({nopostfound: 'No post found for that ID'}));
});

//@route  Delete api/posts/:id
//@desc   delete post
//@access Private
router.delete('/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      //check for post owner
      if(post.user.toString() !== req.user.id){
        return res.status(401).json({noauthorized: 'User not authorized'});
      }
      //delete
      post.remove().then(() => res.json({success: true}));
    })
    .catch(err => json.status(404).json({postnotfound: 'No post found'}));
});


//@route  POST api/posts
//@desc   create post
//@access Private
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
  const {errors, isValid } = validatePostInput(req.body);

  if(!isValid){
    return res.status(400).json(errors);
  }

  const newPost = new Post({
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.avatar,
    user: req.user.id
  });

  newPost.save()
    .then(post => res.json(post))
    .catch(err => console.log(err));

});

module.exports = router;