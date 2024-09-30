const mongoose = require('mongoose');

const ticketPriceSchema = new mongoose.Schema({
  foreigner: { type: Number, required: true }, 
  native: { type: Number, required: true },    
  student: { type: Number, required: true }   
});

const HistoricalPlaceSchema = new mongoose.Schema({
  name: { type: String, required: true },             
  description: { type: String, required: true },     
  pictures: [{ type: String }],   // List of picture URLs              
  location: { type: String, required: true },         
  openingHours: { type: String, required: true },     
  ticketPrices: { type: ticketPriceSchema, required: true }  ,
  AuthorUsername :{type : String , required: true }
}, { timestamps: true });

const MuseumPlace = mongoose.model('Historical Place', HistoricalPlaceSchema);
module.exports = MuseumPlace;
