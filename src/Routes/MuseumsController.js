const MuseumsModel = require('../Models/Museums.js');
const { default: mongoose } = require('mongoose');
const CreateMuseums = async (req, res) => {
    try {
        // Destructure the required fields from the request body
        const { name, description, pictures, location, openingHours, ticketPrices, AuthorUsername } = req.body;

        const existingMuseum = await MuseumsModel.findOne({ name: name });
        if (existingMuseum) {
            return res.status(400).json({ error: "A museum with this name already exists." });
        }

        // Create a new museum or historical place document in the database
        const NewMuseums = await MuseumsModel.create({
            name,
            description,
            pictures,
            location,
            openingHours,
            ticketPrices,
            AuthorUsername
        });

        // Respond with the created document and a 201 Created status
        res.status(201).json(NewMuseums);
    } catch (error) {
        // Handle validation errors or other errors
        res.status(400).json({ error: error.message }); // Use error.message to provide the correct error message
    }
};

const getMuseumById = async (req, res) => {
    try {
      const museumPlaceId = req.body;
      const museumPlace = await MuseumsModel.findById(museumPlaceId);
  
      if (museumPlace) {
        res.status(200).json(museumPlace);
      } else {
        res.status(404).json({ error : "Museum not found" });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }; 

  //YAASSIN AND AMINA
  const getMuseumByName = async (req, res) => {
    try {
      const {museumName} = req.body;
      const museumPlace = await MuseumsModel.findOne({name: museumName});
  
      if (museumPlace) {
        res.status(200).json(museumPlace);
      } else {
        res.status(404).json({ error : "Museum not found" });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }; 

  const updateMuseum = async (req, res) => {
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
        res.status(400).json({ error : "Museum not found" });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  //YASSIN AND AMINA

  const updateMuseumByName = async (req, res) => {
    // Destructure fields from the request body
    const {name, description, pictures, location, openingHours, ticketPrices, AuthorUsername} = req.body;

    try {
        // Check if the activity exists with the provided name and advertiser name
        const existingMuseum = await MuseumsModel.findOne({ name: name, AuthorUsername: AuthorUsername });
        if (!existingMuseum) {
            return res.status(404).json({ error: "Museum not found for the given Tourism Governer." });
        }

       
        // Prepare an object with the fields to update (excluding AdvertiserName and Name)
        const updateFields = {
          description, pictures, location, openingHours, ticketPrices
        };

        // Filter out any undefined values to avoid updating fields with undefined
        Object.keys(updateFields).forEach(key => updateFields[key] === undefined && delete updateFields[key]);

        // Update the activity
        const updatedMuseum = await MuseumsModel.findOneAndUpdate(
            { name: name, AuthorUsername: AuthorUsername }, // Find by Name and AdvertiserName
            { $set: updateFields }, // Update only the specified fields
            { new: true } // Return the updated document
        );

        // Send the updated activity as a JSON response with a 200 OK status
        res.status(200).json({ msg: "Museum updated successfully!", museum: updatedMuseum });
    } catch (error) {
        // If an error occurs, send a 400 Bad Request status with the error message
        res.status(400).json({ error: error.message });
    }
};

  const deleteMuseumbyID = async (req, res) => {
    try {
      const museumPlaceId = req.body;
      const deletedMuseumPlace = await MuseumsModel.findByIdAndDelete(museumPlaceId);
  
      if (deletedMuseumPlace) {
        res.status(200).json({ message: 'Museum deleted successfully' });
      } else {
        res.status(400).json({ error : "Museum not found" });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  //YASSIN AND AMINA
  const deleteMuseumByName = async (req, res) => {
    try {
      const {name,AuthorUsername} = req.body;

      // Check if the activity exists with the provided name and advertiser name
      const existingMuseum = await MuseumsModel.findOne({ name: name, AuthorUsername: AuthorUsername });
      if (!existingMuseum) {
          return res.status(404).json({ error: "Museum not found for the given Tourism Governer." });
      }
      else{
        await MuseumsModel.findOneAndDelete({ name: name});
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
  module.exports = {CreateMuseums, getMuseumById, updateMuseum ,deleteMuseumbyID ,getMuseumsByAuthor, getMuseumByName, updateMuseumByName, deleteMuseumByName};