const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HistoricalTagsSchema = new Schema({
  NameOfHistoricalTags: {
    type: String,
    required: true,
  }
}, { timestamps: true }); //adds 2 more field (Created At:) & (Updated At:)

const HistoricalTags = mongoose.model('HistoricalTags', HistoricalTagsSchema);
module.exports = HistoricalTags;



