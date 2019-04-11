const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/users')
const Project = require('../models/projects')
const { sessionChecker } = require('../middleware/auth');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
const upload = multer({storage: storage})

router.route('/')
  .get(sessionChecker, async (req, res) => {
    const projects = await Project.find();
    res.render('projects/projects', {projects});
  })
  .post(upload.single('file-to-upload'), async (req, res) => {
    console.log(req.file)
    const project = new Project({
      modStat: false,
      title: req.body.title,
      description: req.body.description,
      images : req.file.filename
    })
    await project.save();
    res.redirect('/projects')
  })

  router.route('/:id')
    .get(async (req,res) => {
      const project = await Project.findById(req.params.id);
      console.log(project)
      res.render('projects/show', {project})
    })
    .delete(async (req,res) => {
      await Project.deleteOne({'_id' : req.params.id})
      res.redirect('/projects')
    })


module.exports = router;