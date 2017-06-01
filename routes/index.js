var models  = require('../models');
var express = require('express');
var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'SimpleApp Express Auth'});
});

router.get("/signup", function(req, res){
  res.render('auth/signup', { title: 'SimpleApp Express Auth'});
});

router.post("/signup", function(req, res, next){
  models.User.findOne({
    where: {
     username: req.body.username
    }
  }).then(function(user){
    if(!user){
      models.User.create({
        username: req.body.username,
      	passwd: bcrypt.hashSync(req.body.password)
      }).then(function(user){
        passport.authenticate("local", {failureRedirect:"/signup", successRedirect: "/authed"})(req, res, next)
      });
    } else {
      res.send("user exists");
    }
  });
});

router.get("/signin", function(req, res){
  res.render("auth/signin")
});

router.post("/signin", passport.authenticate('local', { 
  failureRedirect: '/signin',
  successRedirect: '/authed'
}));

router.get("/authed", function(req, res){
  res.render("authed", {title: "SimpleApp Express Auth", displayUser: req.user.username});
});

router.get("/signout", function(req, res){
  req.session.destroy()
  res.redirect("/signin")
});

// create a user
router.post('/createuser', function(req, res) {
  models.User.create({
    username: req.body.username,
    passwd: req.body.password
  }).then(function(user) {
    res.json(user);
  });
});

// get all todos
router.get('/listusers', function(req, res) {
  models.User.findAll({}).then(function(user) {
    res.json(user);
  });
});

// update a user password
router.put('/updatepass/:name', function(req, res) {
  models.Todo.find({
    where: {
      username: req.params.username
    }
  }).then(function(user) {
    if(user){
      user.updateAttributes({
        passwd: req.body.password
      }).then(function(user) {
        res.send(user);
      });
    }
  });
});

// delete a user
router.delete('/deleteuser/:name', function(req, res) {
  models.User.destroy({
    where: {
      username: req.params.username
    }
  }).then(function(user) {
    res.json(user);
  });
});

module.exports = router;
