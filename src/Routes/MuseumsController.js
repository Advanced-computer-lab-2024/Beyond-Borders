const MuseumsModel = require('../Models/Museums.js');
const TouristModel = require('../Models/Tourist.js');
const TagsModel = require('../Models/HistoricalTags.js');

const { default: mongoose } = require('mongoose');
const CreateMuseums = async (req, res) => {
    try {
        // Destructure the required fields from the request body
        const { name, description, pictures, location, openingHours, ticketPrices,BookingOpen, AuthorUsername , HistoricalTags, dateOfEvent} = req.body;

        const existingMuseum = await MuseumsModel.findOne({ name: name });
        if (existingMuseum) {
            return res.status(400).json({ error: "A museum with this name already exists." });
        }

        // Check if all provided tags exist
        const existingTags = await TagsModel.find({ NameOfHistoricalTags: { $in: HistoricalTags } });
        if (existingTags.length !== HistoricalTags.length) {
          return res.status(400).json({ error: "One or more tags do not exist!" });
        }

        // Create a new museum or historical place document in the database
        const NewMuseums = await MuseumsModel.create({
            name,
            description,
            pictures,
            location,
            openingHours,
            ticketPrices,
            AuthorUsername,
            HistoricalTags,
            BookingOpen,
            dateOfEvent,
            Ratings: 0,
            RatingCount: 0,
            Comments: [],
            SendNotificationTo:[]

        });

        // Respond with the created document and a 201 Created status
        res.status(201).json(NewMuseums);
    } catch (error) {
        // Handle validation errors or other errors
        res.status(400).json({ error: error.message }); // Use error.message to provide the correct error message
    }
};
 
// Backend: MuseumsController.js

const getMuseumByName = async (req, res) => {
  try {
      const { MuseumName } = req.body; // Get Museum name from request body
      const museum = await MuseumsModel.findOne({ name: MuseumName }); // Find museum by name

      if (museum) {
          res.status(200).json(museum); // Send museum details if found
      } else {
          res.status(404).json({ error: "Museum not found" }); // Museum not found
      }
  } catch (error) {
      res.status(400).json({ error: error.message }); // Handle any errors
  }
};

// const updateMuseumByName = async (req, res) => {
//   const { name, description, pictures, location, openingHours,BookingOpen, ticketPrices, AuthorUsername, HistoricalTags } = req.body;

//   try {
//       // Check if the museum exists with the provided name and author username
//       const existingMuseum = await MuseumsModel.findOne({ name: name, AuthorUsername: AuthorUsername });
//       if (!existingMuseum) {
//           return res.status(404).json({ error: "Museum not found for the given Author." });
//       }

//       // If Tags are provided, check if they exist (optional, you can skip if no validation is needed)
//       if (HistoricalTags && HistoricalTags.length > 0) {
//           const existingTags = await TagsModel.find({ NameOfHistoricalTags: { $in: HistoricalTags } });
//           if (existingTags.length !== HistoricalTags.length) {
//               return res.status(400).json({ error: "One or more tags do not exist!" });
//           }
//       }

//       // Prepare an object with the fields to update, including HistoricalTags
//       const updateFields = {
//           description,
//           pictures,
//           location,
//           openingHours,
//           ticketPrices,
//           BookingOpen,
//           HistoricalTags, // Ensure HistoricalTags is part of the updateFields
//       };

//       // Filter out any undefined values to avoid updating fields with undefined
//       Object.keys(updateFields).forEach((key) => updateFields[key] === undefined && delete updateFields[key]);

//       // Update the museum
//       const updatedMuseum = await MuseumsModel.findOneAndUpdate(
//           { name: name, AuthorUsername: AuthorUsername }, // Find by name and AuthorUsername
//           { $set: updateFields }, // Update only the specified fields
//           { new: true } // Return the updated document
//       );

//       // Send the updated museum as a JSON response with a 200 OK status
//       res.status(200).json({ msg: "Museum updated successfully!", museum: updatedMuseum });
//   } catch (error) {
//       // If an error occurs, send a 400 Bad Request status with the error message
//       res.status(400).json({ error: error.message });
//   }
// };

const updateMuseumByName = async (req, res) => {
    const { name, description, pictures, location, openingHours, BookingOpen, ticketPrices, AuthorUsername, HistoricalTags } = req.body;
  
    try {
      // Check if the museum exists with the provided name and author username
      const existingMuseum = await MuseumsModel.findOne({ name: name, AuthorUsername: AuthorUsername });
      if (!existingMuseum) {
        return res.status(404).json({ error: "Museum not found for the given Author." });
      }
  
      // If Tags are provided, check if they exist
      if (HistoricalTags && HistoricalTags.length > 0) {
        const existingTags = await TagsModel.find({ NameOfHistoricalTags: { $in: HistoricalTags } });
        if (existingTags.length !== HistoricalTags.length) {
          return res.status(400).json({ error: "One or more tags do not exist!" });
        }
      }
  
      // Check if BookingOpen is changing from true to false
      if (existingMuseum.BookingOpen === false && BookingOpen === true) {
        // Perform actions when BookingOpen changes from true to false
        // Example: Send a notification to the users or handle booking closure logic
        for (const subscriber of existingMuseum.SendNotificationTo) {
          const { username } = subscriber;
  
          // Find the corresponding tourist
          const tourist = await TouristModel.findOne({ Username: username });
          if (tourist) {
            // Add a notification about the booking closure
            tourist.Notifications.push({
              NotificationText: `The museum "${existingMuseum.name}"is now open for booking!.`,
              Read: false,
            });
            await tourist.save(); // Save the updated tourist document
          }
        }

        existingMuseum.SendNotificationTo = [];
        await existingMuseum.save(); // Save the updated museum document
      }
  
      // Prepare an object with the fields to update, including HistoricalTags
      const updateFields = {
        description,
        pictures,
        location,
        openingHours,
        ticketPrices,
        BookingOpen,
        HistoricalTags,
      };
  
      // Filter out any undefined values to avoid updating fields with undefined
      Object.keys(updateFields).forEach((key) => updateFields[key] === undefined && delete updateFields[key]);
  
      // Update the museum
      const updatedMuseum = await MuseumsModel.findOneAndUpdate(
        { name: name, AuthorUsername: AuthorUsername }, // Find by name and AuthorUsername
        { $set: updateFields }, // Update only the specified fields
        { new: true } // Return the updated document
      );
  
      // Send the updated museum as a JSON response with a 200 OK status
      res.status(200).json({ msg: "Museum updated successfully!", museum: updatedMuseum });
    } catch (error) {
      // If an error occurs, send a 400 Bad Request status with the error message
      res.status(400).json({ error: error.message });
    }
  };



const deleteMuseumByName = async (req, res) => {
  try {
      const { name, AuthorUsername } = req.body;

      // Check if the museum exists with the provided name and author username
      const existingMuseum = await MuseumsModel.findOne({ name: name, AuthorUsername: AuthorUsername });
      if (!existingMuseum) {
          return res.status(404).json({ error: "Museum not found for the given Tourism Governer." });
      }

      // Delete the museum if it exists
      await MuseumsModel.findOneAndDelete({ name: name, AuthorUsername: AuthorUsername });

      // Send a success response after deletion
      res.status(200).json({ message: "Museum deleted successfully." });

  } catch (error) {
      res.status(400).json({ error: error.message });
  }
};


  
  //FIXED
  const getMuseumsByAuthor = async (req, res) => {
    try {
      const {AuthorUsername} = req.body;  // Assuming you get the author's ID from the authenticated user
      
      const museums = await MuseumsModel.find({ AuthorUsername: AuthorUsername });
  
      if (!museums.length) {
        return res.status(404).json({ error : "No museums found for this author" });
      }
  
      res.status(200).json(museums);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  module.exports = {CreateMuseums ,getMuseumsByAuthor, getMuseumByName, updateMuseumByName, deleteMuseumByName};