const TouristModel = require('../Models/Tourist.js');
const AllUsernamesModel = require('../Models/AllUsernames.js');
const ActivityModel = require('../Models/Activity.js');
const ProductModel = require('../Models/Product.js');
const MuseumsModel = require('../Models/Museums.js');
const HistoricalPlacesModel = require('../Models/HistoricalPlaces.js');
const ItineraryModel = require('../Models/Itinerary.js');



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
          // Set query to look for this specific date
          // Use a date range for the entire day
          query.Date = {
              $gte: inputDate, // Start of the day
              $lt: new Date(inputDate.getTime() + 24 * 60 * 60 * 1000) // End of the day, exclusive
          };
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
      // Extract the tags array from the request body
      const { tags } = req.body; // Expecting an array of tags

      // Get the current date
      const currentDate = new Date();

      // Find museums with the specified tags and upcoming events
      const museums = await MuseumsModel.find({
          HistoricalTags: { $in: tags },   // Match any of the specified tags
          dateOfEvent: { $gte: currentDate }, // Only include upcoming events
      });

      // Check if any museums were found
      if (museums.length > 0) {
          res.status(200).json(museums);
      } else {
          res.status(404).json({ error: "No upcoming museums found with the specified tags." });
      }
  } catch (error) {
      console.error("Error fetching museums:", error);
      res.status(400).json({ error: error.message });
  }
};


const getHistoricalPlacesByTagGuest = async (req, res) => {
  try {
      // Extract the tags array from the request body
      const { tags } = req.body; // Expecting an array of tags

      // Get the current date
      const currentDate = new Date();

      // Find historical places with the specified tags and upcoming events
      const historicalPlaces = await HistoricalPlacesModel.find({
          Tags: { $in: tags },          // Match any of the specified tags
          dateOfEvent: { $gte: currentDate }, // Only include upcoming events
      });

      // Check if any historical places were found
      if (historicalPlaces.length > 0) {
          res.status(200).json(historicalPlaces);
      } else {
          res.status(404).json({ error: "No upcoming Historical Places found with the specified tags." });
      }
  } catch (error) {
      console.error("Error fetching Historical Places:", error);
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
        return activity.Date >= currentDate  && activities.flagged === false; 
      });
  
      // Return the upcoming activities as a JSON response
      res.json(upcomingActivities);
    } catch (error) {
      console.error('Error fetching upcoming activities:', error);
      res.status(500).json({ message: 'Error fetching upcoming activities' });
    }
  };

  const ViewAllUpcomingMuseumEventsGuest = async (req, res) => {
    try {
      // Get today's date and set the time to midnight
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0); // Set to 00:00:00.000
  
      // Fetch all activities from the database
      const museumEvents = await MuseumsModel.find(); // Fetch all museums
  
      // Filter activities where the Date is greater than or equal to the current date
      const upcomingMuseumEvents = museumEvents.filter(museumEvents => {
        return museumEvents.dateOfEvent >= currentDate; // Include only upcoming activities
      });
  
      // Return the upcoming activities as a JSON response
      res.json(upcomingMuseumEvents);
    } catch (error) {
      console.error('Error fetching upcoming museum events:', error);
      res.status(500).json({ message: 'Error fetching upcoming museum events' });
    }
  };

  const ViewAllUpcomingHistoricalPlacesEventsGuest = async (req, res) => {
    try {
      // Get today's date and set the time to midnight
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0); // Set to 00:00:00.000
  
      // Fetch all activities from the database
      const historicalPlacesEvents = await HistoricalPlacesModel.find(); // Fetch all museums
  
      // Filter activities where the Date is greater than or equal to the current date
      const upcomingHistoricalPlacesEvents = historicalPlacesEvents.filter(historicalPlacesEvents => {
        return historicalPlacesEvents.dateOfEvent >= currentDate; // Include only upcoming activities
      });
  
      // Return the upcoming activities as a JSON response
      res.json(upcomingHistoricalPlacesEvents);
    } catch (error) {
      console.error('Error fetching upcoming museum events:', error);
      res.status(500).json({ message: 'Error fetching upcoming museum events' });
    }
  };

  const sortActivitiesPriceAscendingGuest = async (req, res) => {
    try {
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
  
      // Get all activities from the database
      const activities = await ActivityModel.find();
  
      // Filter for upcoming activities only
      const upcomingActivities = activities.filter(activity => activity.Date >= currentDate);
  
      // Sort the upcoming activities by price in ascending order
      const sortedUpcomingActivities = upcomingActivities.sort((a, b) => a.Price - b.Price);
  
      // Respond with the sorted activities
      res.status(200).json(sortedUpcomingActivities);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  const sortActivitiesPriceDescendingGuest = async (req, res) => {
    try {
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
  
      // Get all activities from the database
      const activities = await ActivityModel.find();
  
      // Filter for upcoming activities only
      const upcomingActivities = activities.filter(activity => activity.Date >= currentDate);
  
      // Sort the upcoming activities by price in descending order
      const sortedUpcomingActivities = upcomingActivities.sort((a, b) => b.Price - a.Price);
  
      // Respond with the sorted activities
      res.status(200).json(sortedUpcomingActivities);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  const sortActivitiesRatingDescendingGuest = async (req, res) => {
    try {
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
  
      // Get all activities from the database
      const activities = await ActivityModel.find();
  
      // Filter for upcoming activities only
      const upcomingActivities = activities.filter(activity => activity.Date >= currentDate);
  
      // Sort the upcoming activities by rating in descending order
      const sortedUpcomingActivities = upcomingActivities.sort((a, b) => b.Rating - a.Rating);
  
      // Respond with the sorted activities
      res.status(200).json(sortedUpcomingActivities);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  const sortActivitiesRatingAscendingGuest = async (req, res) => {
    try {
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
  
      // Get all activities from the database
      const activities = await ActivityModel.find();
  
      // Filter for upcoming activities only
      const upcomingActivities = activities.filter(activity => activity.Date >= currentDate);
  
      // Sort the upcoming activities by rating in ascending order
      const sortedUpcomingActivities = upcomingActivities.sort((a, b) => a.Rating - b.Rating);
  
      // Respond with the sorted activities
      res.status(200).json(sortedUpcomingActivities);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  const ViewAllUpcomingItinerariesGuest = async (req, res) => {
    try {
      // Get today's date and set the time to midnight
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0); 
      const itineraries = await ItineraryModel.find(); 
      const upcomingItineraries = itineraries.filter(itineraries => {
        return itineraries.Date >= currentDate  && itineraries.flagged === false; 
      });
  
      // Return the upcoming activities as a JSON response
      res.json(upcomingItineraries);
    } catch (error) {
      console.error('Error fetching upcoming itinerary events:', error);
      res.status(500).json({ message: 'Error fetching upcoming itinerary events' });
    }
  };

  const sortItinerariesPriceAscendingGuest = async (req, res) => {
    try {
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
  
      // Get all activities from the database
      const itineraries = await ItineraryModel.find();
  
      // Filter for upcoming activities only
      const upcomingItineraries = itineraries.filter(itinerary => itinerary.Date >= currentDate);
  
      // Sort the upcoming activities by price in ascending order
      const sortedUpcomingItineraries = upcomingItineraries.sort((a, b) => a.Price - b.Price);
  
      // Respond with the sorted activities
      res.status(200).json(sortedUpcomingItineraries);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  const sortItinerariesPriceDescendingGuest = async (req, res) => {
    try {
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
  
      // Get all activities from the database
      const itineraries = await ItineraryModel.find();
  
      // Filter for upcoming activities only
      const upcomingItineraries = itineraries.filter(itinerary => itinerary.Date >= currentDate);
  
      // Sort the upcoming activities by price in descending order
      const sortedUpcomingItineraries = upcomingItineraries.sort((a, b) => b.Price - a.Price);
  
      // Respond with the sorted activities
      res.status(200).json(sortedUpcomingItineraries);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  const filterItinerariesGuest = async (req, res) => {
    const { minPrice, maxPrice, InputDate, Language, Tags } = req.body; // Extract parameters from the request body
    const query = { isBooked: true }; // Initialize an empty query object and set isBooked to true
  
    // Get the current date and set time to midnight
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
  
    if (InputDate) {
        const inputDate = new Date(InputDate);
        inputDate.setHours(0, 0, 0, 0); // Normalize input date to midnight
  
        if (inputDate < currentDate) {
            return res.status(404).json({ msg: "Itinerary Events with this date have passed!" });
        } else {
            // Set query to look for this specific date
            // Use a date range for the entire day
            query.Date = {
                $gte: inputDate, // Start of the day
                $lt: new Date(inputDate.getTime() + 24 * 60 * 60 * 1000) // End of the day, exclusive
            };
        }
    } else {
        // Always set the date filter to only include activities on or after the current date
        query.Date = { $gte: currentDate }; // Activities must be after today
    }
  
    // Build the query based on provided parameters
    if (Language) {
        query.Language = Language; // Add language filter if provided
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
        query.Price = { $gte: minPrice }; 
    } else if (maxPrice !== undefined) {
        // Only maxPrice is provided
        query.Price = { $lte: maxPrice }; // Less than or equal to maxPrice
    }
  
    // Filter by Tags if provided
    if (Tags && Tags.length > 0) {
        query.Tags = { $in: Tags }; 
    }
  
    try {
        const fetchedItineraries = await ItineraryModel.find(query); 
        if (fetchedItineraries.length === 0) {
            return res.status(404).json({ msg: "No itineraries found for the given criteria!" });
        }
        res.status(200).json(fetchedItineraries); 
    } catch (error) {
        console.error('Error fetching itineraries:', error);
        res.status(500).json({ msg: "An error occurred while fetching itineraries." });
    }
  };
  
  const ChooseActivitiesByCategoryGuest = async (req, res) => {
    const { Category } = req.body; // req.query
  
    if (!Category) {
      return res.status(400).json({ error: "Category is required." });
    }
  
    try {
      const activities = await ActivityModel.find({ Category: Category });
  
      if (activities.length === 0) {
        return res.status(404).json({ msg: "No activities found for this category." });
      }
  
      res.status(200).json(activities);
    } catch (error) {
      console.error('Error fetching activities by category:', error);
      res.status(500).json({ msg: "An error occurred while fetching activities." });
    }
  };
  




module.exports = {filterActivitiesGuest, getMuseumsByTagGuest,ViewAllUpcomingActivitiesGuest, ViewAllUpcomingMuseumEventsGuest, getHistoricalPlacesByTagGuest, ViewAllUpcomingHistoricalPlacesEventsGuest, sortActivitiesPriceAscendingGuest, sortActivitiesPriceDescendingGuest, sortActivitiesRatingDescendingGuest, sortActivitiesRatingAscendingGuest, ViewAllUpcomingItinerariesGuest, sortItinerariesPriceAscendingGuest, sortItinerariesPriceDescendingGuest, filterItinerariesGuest,ChooseActivitiesByCategoryGuest};