const express = require('express');
const { sessionChecker } = require('../middleware/auth');
const User = require('../models/users');


const router = express.Router();
// route for Home-Page
router.get('/', (req, res) => {
  res.render('index');
});

// route for user's dashboard
router.get('/dashboard', (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
    res.render('dashboard');
  } else {
    res.redirect('/login');
  }
});





module.exports = router;
