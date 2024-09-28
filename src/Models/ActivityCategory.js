const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActivityCategorySchema = new Schema({
  NameOfCategory: {
    type: String,
    required: true,
  }
}, { timestamps: true }); //adds 2 more field (Created At:) & (Updated At:)

const ActivityCategory = mongoose.model('ActivityCategory', ActivityCategorySchema);
module.exports = ActivityCategory;