const HistoricalPlacesModel = require('../Models/HistoricalPlaces.js');
// const HistoricalTags = require('../Models/HistoricalTags');
const TagsModel = require('../Models/HistoricalTags');
const { default: mongoose } = require('mongoose');
const CreateHistoricalPlace = async (req, res) => {
  try {
      // Destructure the required fields from the request body
      const { name, description, pictures, location, openingHours, ticketPrices, AuthorUsername, Tags, dateOfEvent } = req.body;

      // Validate that Tags is an array
      if (!Array.isArray(Tags) || Tags.length === 0) {
          return res.status(400).json({ error: "Tags must be a valid array." });
      }

      // Check if a historical place with the same name already exists
      const existingHistoricalPlace = await HistoricalPlacesModel.findOne({ name: name });
      if (existingHistoricalPlace) {
          return res.status(400).json({ error: "A historical place with this name already exists." });
      }

      // Check if all provided tags exist
      const existingTags = await TagsModel.find({ NameOfHistoricalTags: { $in: Tags } });
      if (existingTags.length !== Tags.length) {
          return res.status(400).json({ error: "One or more tags do not exist!" });
      }

      // Create a new historical place document in the database
      const NewHistoricalPlace = await HistoricalPlacesModel.create({
          name,
          description,
          pictures,
          location,
          openingHours,
          ticketPrices,
          AuthorUsername,
          Tags,
          dateOfEvent
      });

      // Respond with the created document and a 201 Created status
      res.status(201).json(NewHistoricalPlace);
  } catch (error) {
      // Handle validation errors or other errors
      res.status(400).json({ error: error.message }); // Use error.message to provide the correct error message
  }
};





 const getHistoricalPlaceByName = async (req, res) => {
    try {
      const {HistoricalPlaceName} = req.body;
      const HistoricalPlace = await HistoricalPlacesModel.findOne({name: HistoricalPlaceName});
  
      if (HistoricalPlace) {
        res.status(200).json(HistoricalPlace);
      } else {
        res.status(404).json({ error : "Historical Place not found" });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  const updateHistoricalPlace = async (req, res) => {
    const {name, description, pictures, location, openingHours, ticketPrices, AuthorUsername, HistoricalTags} = req.body;

    try {
        // Check if the activity exists with the provided name and advertiser name
        const existingHistoricalPlace = await HistoricalPlacesModel.findOne({ name: name, AuthorUsername: AuthorUsername });
        if (!existingHistoricalPlace) {
            return res.status(404).json({ error: "HistoricalPLacce not found for the given Tourism Governer." });
        }
         // If Tags are provided, check if they exist
         if (HistoricalTags && HistoricalTags.length > 0) {
          const existingTags = await TagsModel.find({ NameOfHistoricalTags: { $in: HistoricalTags } });
          if (existingTags.length !== HistoricalTags.length) {
              return res.status(400).json({ error: "One or more tags do not exist!" });
          }
      }
       
        // Prepare an object with the fields to update (excluding AdvertiserName and Name)
        const updateFields = {
          description, pictures, location, openingHours, ticketPrices, Tags: HistoricalTags
        };

        // Filter out any undefined values to avoid updating fields with undefined
        Object.keys(updateFields).forEach(key => updateFields[key] === undefined && delete updateFields[key]);

        // Update the activity
        const updatedHistoricalPlace = await HistoricalPlacesModel.findOneAndUpdate(
            { name: name, AuthorUsername: AuthorUsername }, // Find by Name and AdvertiserName
            { $set: updateFields }, // Update only the specified fields
            { new: true } // Return the updated document
        );

        // Send the updated activity as a JSON response with a 200 OK status
        res.status(200).json({ msg: "Historical place updated successfully!", HistoricalPlace: updatedHistoricalPlace });
    } catch (error) {
        // If an error occurs, send a 400 Bad Request status with the error message
        res.status(400).json({ error: error.message });
    }
  };
  const deleteHistoricalPlacebyName = async (req, res) => {
    try {
        const { name, AuthorUsername } = req.body;

        // Attempt to delete the historical place with the provided name and author username
        const deletedHistoricalPlace = await HistoricalPlacesModel.findOneAndDelete({ name: name, AuthorUsername: AuthorUsername });

        // Check if the historical place was found and deleted
        if (!deletedHistoricalPlace) {
            return res.status(404).json({ error: "Historical Place not found for the given Tourism Governer." });
        }

        // Respond with success message
        res.status(200).json({ message: "Historical Place deleted successfully." });

    } catch (error) {
        // Handle errors and respond with a 400 Bad Request status
        res.status(400).json({ error: error.message });
    }
};
  const getHistoricalPlaceByAuthor = async (req, res) => {
    try {
      const {AuthorUsername} = req.body;  // Assuming you get the author's ID from the authenticated user
      
      const HistoricalPlaces = await HistoricalPlacesModel.find({ AuthorUsername: AuthorUsername });
  
      if (!HistoricalPlaces.length) {
        return res.status(404).json({ error : "No Historical places found for this author" });
      }
  
      res.status(200).json(HistoricalPlaces);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  module.exports = {CreateHistoricalPlace, updateHistoricalPlace ,getHistoricalPlaceByAuthor , deleteHistoricalPlacebyName , getHistoricalPlaceByName  };