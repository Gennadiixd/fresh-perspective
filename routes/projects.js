const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/users')
const { sessionChecker } = require('../middleware/auth');

router.get('/', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
      res.render('projects');
    } else {
      res.redirect('/users/login');
    }
  });

  module.exports = router;