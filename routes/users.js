const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/users')
const { sessionChecker } = require('../middleware/auth');

router.get('/logout', async (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
    try {
      // res.clearCookie('user_sid');
      await req.session.destroy();
      res.redirect('/');
    }
    catch (error) {
      next(error);
    }
  } else {
    res.redirect('/login');
  }
});

router.route('/signup')
  .get((req, res) => {
    res.render('signup');
  })
  .post(async (req, res) => {    
    try {
      const user = new User({
        name: req.body.username,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
      })
      await user.save();
      req.session.user = user;
      res.redirect('/');
    }
    catch (error) {
      res.redirect('/users/signup');
    };
  });


router.route('/login')
  .get((req, res) => {
    res.render('login');
  })
  .post(async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = await User.findOne({ name: username });
    if (!user) {
      res.redirect('/login');
      // } else if (!user.validPassword(password)) {
    } else if (user.password !== password) {
      res.redirect('/login');
    } else {
      req.session.user = user;
      res.redirect('/');
    }

  });


module.exports = router;
