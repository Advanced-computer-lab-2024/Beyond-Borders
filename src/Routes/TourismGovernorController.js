const HistoricalTagsModel = require('../Models/HistoricalTags');

const { default: mongoose } = require('mongoose');

const createNewHistoricalTag = async(req,res) => {
    //Destructure Name, Email, Age from the request body
    const{NameOfHistoricalTags} = req.body;
    try{
       // Check if a user with the same Username already exists
       const existingHistoricalTag = await HistoricalTagsModel.findOne({NameOfHistoricalTags});
       if (existingHistoricalTag) {
           return res.status(400).json({ error: "Tag already exists!" });
       }
       //add a new category to the database with Name, Email and Age
       const newTag = await HistoricalTagsModel.create({NameOfHistoricalTags});
       //Send the created use as a JSON response with a 200 OK status 
       res.status(200).json({msg:"New Historical Tag is created!"});
       //res.status(200).json(user);
    } catch (error){
       //If an error occurs, send a 400 Bad Request status with the error message
       res.status(400).json({ error: error.message});
    }
 };
// Museums part as a Tourism governer
const{CreateMuseums} = require('./MuseumsController');
const{getMuseumById} = require('./MuseumsController');
const{updateMuseum} = require('./MuseumsController');
const{deleteMuseumbyID} = require('./MuseumsController');
const{getMuseumsByAuthor} = require('./MuseumsController');

const createMuseumsAsTourismGoverner = async(req,res) => {
   try{
    await CreateMuseums(req,res);
   }  
   catch(error){
    res.status(500).json({error : error.msg});
   }
}
const getMuseumByIdAsTourismGoverner = async(req,res) =>{
   try{
      await getMuseumById(req,res);
   }
   catch(error){
      res.status(500).json({error: error.msg})
   }
}
const updateMuseumAsTourismGoverner = async(req,res) =>{
   try{
      await updateMuseum(req,res);
   }
   catch(error){
      res.status(500).json({error: error.msg});
   }
}
const deleteMuseumAsTourismGoverner = async(req,res) =>{
   try{
      await deleteMuseumbyID(req,res);
   }
   catch(error){
      res.status(500).json({error : error.msg});
   }
}
const getMuseumsByAuthorAsTourismGoverner = async(req,res) =>{
   try{
      await getMuseumsByAuthor(req,res);
   }
   catch(error){
      res.status(500).json({error : error.msg})
   }
}
 // Historical places part as a Tourism governer
 const{CreateHistoricalPlace} = require('./HistoricalPlaceController');
 const{getHistoricalPlacePlaceById} = require('./HistoricalPlaceController');
 const{updateHistoricalPlace} = require('./HistoricalPlaceController');
 const{deleteHistoricalPlacebyID} = require('./HistoricalPlaceController');
 const{getHistoricalPlaceByAuthor} = require('./HistoricalPlaceController');
 const createHistoricalPlaceAsTourismGoverner = async(req,res) => {
   try{
    await CreateHistoricalPlace(req,res);
   }  
   catch(error){
    res.status(500).json({error : error.msg});
   }
}
const getHistoricalPlaceByIdAsTourismGoverner = async(req,res) =>{
   try{
      await getHistoricalPlacePlaceById(req,res);
   }
   catch(error){
      res.status(500).json({error: error.msg})
   }
}
const updateHistoricalPlaceAsTourismGoverner = async(req,res) =>{
   try{
      await updateHistoricalPlace(req,res);
   }
   catch(error){
      res.status(500).json({error: error.msg});
   }
}
const deletePlaceAsTourismGoverner = async(req,res) =>{
   try{
      await deleteHistoricalPlacebyID(req,res);
   }
   catch(error){
      res.status(500).json({error : error.msg});
   }
}
const getHistoricalByAuthorAsTourismGoverner = async(req,res) =>{
   try{
      await getHistoricalPlaceByAuthor(req,res);
   }
   catch(error){
      res.status(500).json({error : error.msg})
   }
}
 module.exports = {createNewHistoricalTag,createMuseumsAsTourismGoverner,getMuseumByIdAsTourismGoverner,updateMuseumAsTourismGoverner,deleteMuseumAsTourismGoverner,getMuseumsByAuthorAsTourismGoverner
   ,createHistoricalPlaceAsTourismGoverner , getHistoricalPlaceByIdAsTourismGoverner , updateHistoricalPlaceAsTourismGoverner , deletePlaceAsTourismGoverner , getHistoricalByAuthorAsTourismGoverner
 };