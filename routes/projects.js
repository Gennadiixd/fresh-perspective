const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/users')
const Project = require('../models/projects')
const { sessionChecker } = require('../middleware/auth');

router.route('/')
  .get(sessionChecker, async (req, res) => {
    const projects = await Project.find();
    res.render('projects/projects', {projects});
  })
  .post(async (req, res) => {
    const project = new Project({
      modStat: false,
      title: req.body.title,
      description: req.body.description
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