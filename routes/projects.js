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
const upload = multer({ storage: storage })

router.route('/')
  .get(sessionChecker, async (req, res) => {
    const projects = await Project.find({ modStat: 'accepted' });
    res.render('projects/projects', { projects });
  })
  .post(upload.single('file-to-upload'), async (req, res) => {
    console.log(req.file)
    const project = new Project({
      modStat: 'pending',
      title: req.body.title,
      description: req.body.description,
      images: req.file.filename,
      author: req.session.user.name,
    })
    await project.save();
    res.redirect(`/projects/${project._id}`)
  })

router.route('/accept/:id')
  .put(async (req, res) => {
    const project = await Project.findById(req.params.id);
    project.modStat = 'accepted';
    await project.save();
    res.redirect('../../projects/moderate/pending');
  })
  .post()

router.route('/reject/:id')
  .put(async (req, res) => {
    const project = await Project.findById(req.params.id);
    project.modStat = 'rejected';
    await project.save();
    res.redirect('../../projects/moderate/pending');
  })

router.route('/moderate/pending')
  .get(async (req, res) => {
    const projects = await Project.find({ modStat: 'pending' });
    res.render('projects/ownprojects', { projects: projects, modStat: 'pending' });
  })

router.route('/moderate/accepted')
  .get(async (req, res) => {
    const projects = await Project.find({ modStat: 'true' });
    res.render('projects/ownprojects', { projects: projects, modStat: 'accepted' });
  })

router.route('/moderate/rejected')
  .get(async (req, res) => {
    const projects = await Project.find({ modStat: 'false' });
    res.render('projects/ownprojects', { projects: projects, modStat: 'rejected' });
  })

router.route('/:id')
  .get(async (req, res) => {
    const project = await Project.findById(req.params.id);
    res.render('projects/show', { project })
  })
  .delete(async (req, res) => {
    await Project.deleteOne({ '_id': req.params.id })
    res.redirect('/projects')
  })

router.route('/show/:name')
  .get(async (req, res) => {
    const projects = await Project.find({ author: req.params.name });
    res.render('projects/ownprojects', { projects });
  })
  .post()




module.exports = router;