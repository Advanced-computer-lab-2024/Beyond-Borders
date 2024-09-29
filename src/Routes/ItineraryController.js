const ItineraryModel = require('../Models/itinerary.js');
const { default: mongoose } = require('mongoose');



;
  const createItinerary = async(req, res) => {
    const {
      title,
      activities,  // This will be an array of activity objects
      language,
      price,
      availableDates,
      accessibility,
      pickupLocation,
      dropoffLocation
    } = req.body;
  
    try {
      // Validate activities array
      if (!Array.isArray(activities) || activities.length === 0) {
        throw new Error("Activities array is required and cannot be empty.");
      }
  
      // Validate each activity object in the array
      activities.forEach(activity => {
        if (!activity.name || !activity.location || !activity.timeline || !activity.duration) {
          throw new Error("Each activity must have a name, location, timeline, and duration.");
        }
      });
  
      const itinerary = await ItineraryModel.create({
        title,
        activities,   // No need to explicitly handle sub-fields, Mongoose will handle it based on the schema
        language,
        price,
        availableDates,
        accessibility,
        pickupLocation,
        dropoffLocation
      });
  
      res.status(200).json(itinerary);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  module.exports = {createItinerary}