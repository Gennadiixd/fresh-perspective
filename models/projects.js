const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    modStat : Boolean,
    title : String,
    description : String,
    images : Array,
    author : String
});

module.exports = mongoose.model('Project', projectSchema);
