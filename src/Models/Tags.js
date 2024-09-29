const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TagsSchema = new Schema({
  NameOfTags: {
    type: String,
    required: true,
  }
}, { timestamps: true }); //adds 2 more field (Created At:) & (Updated At:)

const Tags = mongoose.model('Tags', TagsSchema);
module.exports = Tags;