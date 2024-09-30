const HistoricalPlacesModel = require('../Models/HistoricalPlaces.js');
const { default: mongoose } = require('mongoose');
const CreateHistoricalPlace = async (req, res) => {
    try {
        // Destructure the required fields from the request body
        const { name, description, pictures, location, openingHours, ticketPrices, AuthorUsername } = req.body;

        // Create a new museum or historical place document in the database
        const NewHistoricalPlace = await HistoricalPlacesModel.create({
            name,
            description,
            pictures,
            location,
            openingHours,
            ticketPrices,
            AuthorUsername
        });

        // Respond with the created document and a 201 Created status
        res.status(201).json(NewHistoricalPlace);
    } catch (error) {
        // Handle validation errors or other errors
        res.status(400).json({ error: error.message }); // Use error.message to provide the correct error message
    }
};

const getHistoricalPlacePlaceById = async (req, res) => {
    try {
      const HistoricalPlaceId = req.body;
      const HistoricalPlace = await HistoricalPlacesModel.findById(HistoricalPlaceId);
  
      if (HistoricalPlace) {
        res.status(200).json(HistoricalPlace);
      } else {
        res.status(404).json({ error : "Historical place not found" });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }; 

  const updateHistoricalPlace = async (req, res) => {
    try {
      const HistoricalPlaceId = req.body;
      const updateData = req.body;
  
      const updatedHistoricalPlace = await HistoricalPlacesModel.findByIdAndUpdate(
        HistoricalPlaceId,
        updateData,
        { new: true, runValidators: true }
      );
  
      if (updatedHistoricalPlace) {
        res.status(200).json(updatedHistoricalPlace);
      } else {
        res.status(400).json({ error : "Historical place not found" });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  const deleteHistoricalPlacebyID = async (req, res) => {
    try {
      const HistoricalPlaceId = req.body;
      const deletedHistoricalPlace = await HistoricalPlacesModel.findByIdAndDelete(HistoricalPlaceId);
  
      if (deletedHistoricalPlace) {
        res.status(200).json({ message: 'Historical place deleted successfully' });
      } else {
        res.status(400).json({ error : "Historical place not found" });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  const getHistoricalPlaceByAuthor = async (req, res) => {
    try {
      const AuthorUsername = req.body;  // Assuming you get the author's ID from the authenticated user
      
      const HistoricalPlaces = await HistoricalPlacesModel.find({ createdBy: AuthorUsername });
  
      if (!HistoricalPlaces.length) {
        return res.status(404).json({ error : "No Historical places found for this author" });
      }
  
      res.status(200).json(HistoricalPlaces);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  module.exports = {CreateHistoricalPlace, getHistoricalPlacePlaceById, updateHistoricalPlace ,deleteHistoricalPlacebyID ,getHistoricalPlaceByAuthor};