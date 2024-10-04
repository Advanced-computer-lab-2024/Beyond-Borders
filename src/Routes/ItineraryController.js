const ItineraryModel = require('../Models/Itinerary.js');
const { default: mongoose } = require('mongoose');



;
  const createItinerary = async(req, res) => {
    const {
      Title,
      Activities,  // This will be an array of activity objects
      Locations,
      Timeline,
      Language,
      Price,
      Date,
      availableDates,
      accessibility,
      pickupLocation,
      dropoffLocation,
      Tags
    } = req.body;
  
    try {
      //  Validate activities array
      // if (!Array.isArray(Activities) || Activities.length === 0) {
      //   throw new Error("Activities array is required and cannot be empty.");
      // }
  
      // Validate each activity object in the array
      // Activities.forEach(activity => {
      //   if (!activity.name || !activity.location || !activity.timeline || !activity.duration) {
      //     throw new Error("Each activity must have a name, location, timeline, and duration.");
      //   }
      // });
  
      const itinerary = await ItineraryModel.create({
        Title,
        Activities,   // No need to explicitly handle sub-fields, Mongoose will handle it based on the schema
        Locations,
        Timeline,
        Language,
        Price,
        Date,
        availableDates,
        accessibility,
        pickupLocation,
        dropoffLocation,
        isBooked: false,
        Tags
      });
  
      res.status(200).json(itinerary);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  // Search itineraries by title
  const readItineraryByTitle = async (req, res) => {
    const { Title } = req.params; // Assuming the title is passed as a URL parameter
  
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
  };
  
  const updateItineraryByTitle = async (req, res) => {
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
  const deleteItineraryByTitle = async (req, res) => {
    const { Title } = req.params; // Assuming the title is passed as a URL parameter
  
    try {
      // Find and delete the itinerary by title (case-insensitive)
      const itinerary = await ItineraryModel.findOneAndDelete({
        title: { $regex: new RegExp(Title, 'i') } // Case-insensitive search
      });
  
      // If itinerary not found, return a 404 error
      if (!itinerary) {
        return res.status(404).json({ error: "Itinerary not found with the given title." });
      }
      if(itinerary.isBooked = true){
        return res.status(404).json({error:"Cannot Delete a booked itinerary "})
      }
  
      // Return a success message
      res.status(200).json({ message: "Itinerary successfully deleted." });
    } catch (error) {
      // Catch any errors
      res.status(500).json({ error: error.message });
    }
  };
  


  module.exports = {createItinerary,readItineraryByTitle,updateItineraryByTitle,deleteItineraryByTitle};