const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/users')
const { sessionChecker } = require('../middleware/auth');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
const upload = multer({storage: storage})

router.get('/', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
      res.render('projects');
    } else {
      res.redirect('/users/login');
    }
  });

router.post('/add', upload.single('file-to-upload'), (req, res) => {
    console.log(req.file.path);    
  });

module.exports = router;