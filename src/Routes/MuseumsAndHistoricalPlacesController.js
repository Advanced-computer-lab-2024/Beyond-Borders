const MuseumsModel = require('../Models/MuseumsAndHistoricalPlaces.js');
const { default: mongoose } = require('mongoose');
const CreateMuseumsAndHistoricalPlaces = async (req, res) => {
    try {
        // Destructure the required fields from the request body
        const { name, description, pictures, location, openingHours, ticketPrices, AuthorUsername } = req.body;

        // Create a new museum or historical place document in the database
        const NewMuseumsAndHistoricalPlaces = await MuseumsModel.create({
            name,
            description,
            pictures,
            location,
            openingHours,
            ticketPrices,
            AuthorUsername
        });

        // Respond with the created document and a 201 Created status
        res.status(201).json(NewMuseumsAndHistoricalPlaces);
    } catch (error) {
        // Handle validation errors or other errors
        res.status(400).json({ error: error.message }); // Use error.message to provide the correct error message
    }
};

const getMuseumPlaceById = async (req, res) => {
    try {
      const museumPlaceId = req.body;
      const museumPlace = await MuseumsModel.findById(museumPlaceId);
  
      if (museumPlace) {
        res.status(200).json(museumPlace);
      } else {
        res.status(404).json({ error : "Museum or historical place not found" });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }; 

  const updateMuseumPlace = async (req, res) => {
    try {
      const museumPlaceId = req.body;
      const updateData = req.body;
  
      const updatedMuseumPlace = await MuseumsModel.findByIdAndUpdate(
        museumPlaceId,
        updateData,
        { new: true, runValidators: true }
      );
  
      if (updatedMuseumPlace) {
        res.status(200).json(updatedMuseumPlace);
      } else {
        res.status(400).json({ error : "Museum or historical place not found" });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  const deleteMuseumPlacebyID = async (req, res) => {
    try {
      const museumPlaceId = req.body;
      const deletedMuseumPlace = await MuseumsModel.findByIdAndDelete(museumPlaceId);
  
      if (deletedMuseumPlace) {
        res.status(200).json({ message: 'Museum or historical place deleted successfully' });
      } else {
        res.status(400).json({ error : "Museum or historical place not found" });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  const getMuseumsByAuthor = async (req, res) => {
    try {
      const AuthorUsername = req.body;  // Assuming you get the author's ID from the authenticated user
      
      const museums = await MuseumsModel.find({ createdBy: AuthorUsername });
  
      if (!museums.length) {
        return res.status(404).json({ error : "No museums found for this author" });
      }
  
      res.status(200).json(museums);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  module.exports = {CreateMuseumsAndHistoricalPlaces, getMuseumPlaceById, updateMuseumPlace ,deleteMuseumPlacebyID ,getMuseumsByAuthor};