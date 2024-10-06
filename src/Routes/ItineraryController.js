const ItineraryModel = require('../Models/Itinerary.js');
const TagsModel = require('../Models/Tags.js');
const { default: mongoose } = require('mongoose');



;
  const createItinerary = async(req, res) => {
    const {
      Title,
      Activities,
      Locations,
      Timeline,
      Language,
      Price,
      Date,
      accessibility,
      pickupLocation,
      dropoffLocation,
      Tags,
      AuthorUsername
    } = req.body;
    try {
      // Check if the itinerary title already exists
    const existingItinerary = await ItineraryModel.findOne({ Title });
    if (existingItinerary) {
      return res.status(400).json({ error: "An itinerary with this title already exists!" });
    }
      const existingTags = await TagsModel.find({ NameOfTags: { $in: Tags } });
      if (existingTags.length !== Tags.length) {
        return res.status(400).json({ error: "One or more tags do not exist!" });
      }
      const itinerary = await ItineraryModel.create({
        Title,
        Activities,
        Locations,
        Timeline,
        Language,
        Price,
        Date,
        accessibility,
        pickupLocation,
        dropoffLocation,
        isBooked : false ,
        Tags,
        AuthorUsername
      });
  
      res.status(200).json(itinerary);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  // Search itineraries by title
  /*const readItineraryByTitle = async (req, res) => {
    const { Title } = req.query; // Assuming the title is passed as a URL parameter
  
    try {
      // Find the itinerary by title (case-insensitive)
      const itinerary = await ItineraryModel.findOne({ 
        Title: { $regex: new RegExp(Title, 'i') }  // Case-insensitive search using RegExp
      });
  
      // If itinerary not found, return a 404 error
      if (!itinerary) {
        return res.status(404).json({ error: "Itinerary not found with the given title." });
      }
  
      // If itinerary is found, return the details
      res.status(200).json(itinerary);
    } catch (error) {
      // Catch any errors
      res.status(500).json({ error: error.message });
    }
  };*/


  const readItineraryByTitle = async (req, res) => {
    const { Title } = req.query; // Get the title from the query parameters

    try {
        // Check if an itinerary with the same title exists (case-insensitive)
        const itinerary = await ItineraryModel.findOne({Title: { $regex: new RegExp(Title, 'i') }});

        if (itinerary) {
            // If itinerary found, return the details
            res.status(200).json(itinerary);
        } else {
            // If not found, return a 400 error
            res.status(400).json({ error: "No itinerary found with this title!" });
        }
    } catch (error) {
        // If an error occurs, send a 400 Bad Request status with the error message
        res.status(400).json({ error: error.message });
    }
};
  
const updateItineraryByTitle = async (req, res) => {
  const { Title,
      Activities,
      Locations,
      Timeline,
      Language,
      Price,
      Date,
      accessibility,
      pickupLocation,
      dropoffLocation,
      Tags
  } = req.body;

  try {
      // Find the itinerary by its title (case-insensitive)
      const itinerary = await ItineraryModel.findOne({ Title: { $regex: new RegExp(Title, 'i') } });

      // If no itinerary is found, return a 404 error
      if (!itinerary) {
          return res.status(404).json({ error: "Itinerary not found!" });
      }

      // If Tags are provided, check if they exist
      if (Tags && Tags.length > 0) {
        const existingTags = await TagsModel.find({ NameOfTags: { $in: Tags } });
        if (existingTags.length !== Tags.length) {
            return res.status(400).json({ error: "One or more tags do not exist!" });
        }
      }

      // Prepare an object with the fields to update (excluding AdvertiserName and Name)
      const updateFields = {
        Activities,
        Locations,
        Timeline,
        Language,
        Price,
        Date,
        accessibility,
        pickupLocation,
        dropoffLocation,
        Tags
      };

      // Filter out any undefined values to avoid updating fields with undefined
      Object.keys(updateFields).forEach(key => updateFields[key] === undefined && delete updateFields[key]);

      // Update the itinerary
      const updatedItinerary = await ItineraryModel.findOneAndUpdate(
        { Title: Title}, 
        { $set: updateFields }, // Update only the specified fields
        { new: true } // Return the updated document
    );

    // Send the updated activity as a JSON response with a 200 OK status
    res.status(200).json({ msg: "Itinerary updated successfully!", itinerary: updatedItinerary });

  } catch (error) {
      // If an error occurs, send a 500 Internal Server Error status with the error message
      res.status(500).json({ error: error.message });
  }
};


  /*const updateItineraryByTitle = async (req, res) => {
    const { Title } = req.params; // Assuming the title is passed as a URL parameter
    const {
      Activities,
      Loacation,
      Timeline,
      Language,
      Price,
      Date,
      availableDates,
      accessibility,
      pickupLocation,
      dropoffLocation,
      Tags
      
    } = req.body; // Data to update
  
    try {
      // Find and update the itinerary by title (case-insensitive)
      const itinerary = await ItineraryModel.findOneAndUpdate(
        { Title: { $regex: new RegExp(Title, 'i') } }, // Case-insensitive title search
        {
          Activities,
          Loacation,
          Timeline,
          Language,
          Price,
          Date,
          availableDates,
          accessibility,
          pickupLocation,
          dropoffLocation,
          Tags
        },
        { new: true, runValidators: true } // 'new' returns the updated document; 'runValidators' ensures validation
      );
  
      // If itinerary not found, return a 404 error
      if (!itinerary) {
        return res.status(404).json({ error: "Itinerary not found with the given title." });
      }
  
      // Return the updated itinerary
      res.status(200).json(itinerary);
    } catch (error) {
      // Catch any errors
      res.status(400).json({ error: error.message });
    }
  };
*/























  /*const deleteItineraryByTitle = async (req, res) => {
    const { Title } = req.params; // Assuming the title is passed as a URL parameter
  
    try {
      // Find the itinerary by title (case-insensitive)
      const itinerary = await ItineraryModel.findOne({
        Title: { $regex: new RegExp(Title, 'i') } // Case-insensitive search
      });
  
      // If itinerary not found, return a 404 error
      if (!itinerary) {
        return res.status(404).json({ error: "Itinerary not found with the given title." });
      }
  
      // Check if the itinerary is booked
      if (itinerary.isBooked === true) {
        return res.status(400).json({ error: "Cannot delete a booked itinerary." });
      }
  
      // If the itinerary is not booked, proceed to delete it
      await itinerary.deleteOne(); // Instead of calling findOneAndDelete again, directly delete the found document
  
      // Return a success message
      res.status(200).json({ message: "Itinerary successfully deleted." });
    } catch (error) {
      // Catch any errors
      res.status(500).json({ error: error.message });
    }
  };*/



  const deleteItineraryByTitle = async (req, res) => {
    const { Title } = req.body; // Get the title from the query parameters

    try {
        // Check if the itinerary exists by title (case-insensitive)
        const itinerary = await ItineraryModel.findOne({
            Title: { $regex: new RegExp(Title, 'i') } // Case-insensitive search
        });

        // If itinerary not found, return a 404 error
        if (!itinerary) {
            return res.status(404).json({ error: "Itinerary not found with the given title." });
        }

        // Check if the itinerary is booked
        if (itinerary.isBooked === true) {
            return res.status(400).json({ error: "Cannot delete a booked itinerary." });
        }

        // If the itinerary is not booked, proceed to delete it
        await itinerary.deleteOne(); // Directly delete the found document

        // Return a success message
        res.status(200).json({ message: "Itinerary successfully deleted." });
    } catch (error) {
        // If an error occurs, send a 500 Internal Server Error status with the error message
        res.status(500).json({ error: error.message });
    }
};







  const getItinerarysByAuthor = async (req, res) => {
    try {
      // Assuming you get the author's username from query parameters
      const { AuthorUsername } = req.query; 
      
      // Validate that AuthorUsername is provided
      if (!AuthorUsername) {
        return res.status(400).json({ error: "Author username is required." });
      }
  
      const Itinerarys = await ItineraryModel.find({ AuthorUsername : AuthorUsername });
  
      if (!Itinerarys.length) {
        return res.status(404).json({ error: "You have not created any itinerarys." });
      }
  
      res.status(200).json(Itinerarys);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  


  module.exports = {createItinerary,readItineraryByTitle,updateItineraryByTitle,deleteItineraryByTitle,getItinerarysByAuthor};