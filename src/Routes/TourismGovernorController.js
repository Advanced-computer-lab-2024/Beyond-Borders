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
// Museums and historical places part as a Tourism governer
const{CreateMuseumsAndHistoricalPlaces, getMuseumPlaceById, updateMuseumPlace ,deleteMuseumPlacebyID ,getMuseumsByAuthor} = require('./MuseumsAndHistoricalPlacesController');
const createMuseumsAsTourismGoverner = async(req,res) => {
   try{
    await CreateMuseumsAndHistoricalPlaces(req.res);
   }  
   catch(error){
    res.status(500).json({error : error.msg});
   }
}
const getMuseumPlaceByIdAsTourismGoverner = async(req,res) =>{
   try{
      await getMuseumPlaceById(req,res);
   }
   catch(error){
      res.status(500).json({error: error.msg})
   }
}
const updateMuseumPlaceAsTourismGoverner = async(req,res) =>{
   try{
      await updateMuseumPlace(req,res);
   }
   catch(error){
      res.status(500).json({error: error.msg});
   }
}
const deleteMuseumPlaceAsTourismGoverner = async(req,res) =>{
   try{
      await deleteMuseumPlacebyID(req,res);
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
 

 module.exports = {createNewHistoricalTag,createMuseumsAsTourismGoverner,getMuseumPlaceByIdAsTourismGoverner,updateMuseumPlaceAsTourismGoverner,deleteMuseumPlaceAsTourismGoverner,getMuseumsByAuthorAsTourismGoverner};