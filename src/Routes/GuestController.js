const TouristModel = require('../Models/Tourist.js');
const AllUsernamesModel = require('../Models/AllUsernames.js');
const ActivityModel = require('../Models/Activity.js');
const ProductModel = require('../Models/Product.js');
const MuseumsModel = require('../Models/Museums.js');

//const MuseumModel = require('../Models/Museum.js');
//const ItineraryModel = require('../Models/Itinerary.js');
const { default: mongoose } = require('mongoose');


const filterActivitiesGuest = async (req, res) => {
    const { Category, minPrice, maxPrice, InputDate, Rating } = req.body; // Extract parameters from the request body
    const query = {}; // Initialize an empty query object

    // Get the current date and set time to midnight
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (InputDate) {
        const inputDate = new Date(InputDate);
        inputDate.setHours(0, 0, 0, 0); // Normalize input date to midnight

        if (inputDate < currentDate) {
            return res.status(404).json({ msg: "Activities with this date have passed!" });
        } else {
            query.Date = inputDate; // Set query to look for this specific date
        }
    } else {
        // Always set the date filter to only include activities on or after the current date
        query.Date = { $gte: currentDate }; // Activities must be after today
    }

    // Build the query based on provided parameters
    if (Category) {
        query.Category = Category; // Add category filter if provided
    }

    // Add price filters based on minPrice and maxPrice
    if (minPrice !== undefined && maxPrice !== undefined) {
        // Both minPrice and maxPrice are provided
        query.Price = {
            $gte: minPrice, // Greater than or equal to minPrice
            $lte: maxPrice  // Less than or equal to maxPrice
        };
    } else if (minPrice !== undefined) {
        // Only minPrice is provided
        query.Price = { $gte: minPrice }; // Greater than or equal to minPrice
    } else if (maxPrice !== undefined) {
        // Only maxPrice is provided
        query.Price = { $lte: maxPrice }; // Less than or equal to maxPrice
    }

    // Add rating filter if provided
    if (Rating !== undefined) {
        query.Rating = { $gte: Rating }; // Filter for activities with rating greater than or equal to the specified rating
    }

    try {
        const fetchedActivities = await ActivityModel.find(query); // Fetch activities based on the constructed query
        if (fetchedActivities.length === 0) {
            return res.status(404).json({ msg: "No activities found for the given criteria!" });
        }
        res.status(200).json(fetchedActivities); // Respond with the fetched activities
    } catch (error) {
        console.error('Error fetching activities:', error);
        res.status(500).json({ msg: "An error occurred while fetching activities." });
    }
};

const getMuseumsByTagGuest = async (req, res) => {
    try {
        // Extract the tag from the request body
        const { tag } = req.body;

        // Find museums with the specified tag
        const museums = await MuseumsModel.find({ HistoricalTags: tag });

        // Check if any museums were found
        if (museums.length > 0) {
            res.status(200).json(museums);
        } else {
            res.status(404).json({ error: "No museums found with this tag." });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const ViewAllUpcomingActivitiesGuest = async (req, res) => {
    try {
      // Get today's date and set the time to midnight
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0); // Set to 00:00:00.000
  
      // Fetch all activities from the database
      const activities = await ActivityModel.find(); // Fetch all activities
  
      // Filter activities where the Date is greater than or equal to the current date
      const upcomingActivities = activities.filter(activity => {
        return activity.Date >= currentDate; // Include only upcoming activities
      });
  
      // Return the upcoming activities as a JSON response
      res.json(upcomingActivities);
    } catch (error) {
      console.error('Error fetching upcoming activities:', error);
      res.status(500).json({ message: 'Error fetching upcoming activities' });
    }
  };

  const ViewAllMuseumsGuest = async (req, res) => {
    try {
      // Fetch all museums from the database
      const museums = await MuseumsModel.find();
  
      // Return the museums as a JSON response
      res.json(museums);
    } catch (error) {
      console.error('Error fetching museums:', error);
      res.status(500).json({ message: 'Error fetching museums' });
    }
  };



module.exports = {filterActivitiesGuest, getMuseumsByTagGuest,ViewAllUpcomingActivitiesGuest, ViewAllMuseumsGuest };