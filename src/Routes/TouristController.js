// #Task route solution
const TouristModel = require('../Models/Tourist.js');
const AllUsernamesModel = require('../Models/AllUsernames.js');
const ActivityModel = require('../Models/Activity.js');
const ProductModel = require('../Models/Product.js');
const MuseumModel = require('../Models/Museums.js');
const HistoricalPlacesModel = require('../Models/HistoricalPlaces.js');
const HistoricalTagsModel = require('../Models/HistoricalTags.js');
const ComplaintsModel = require('../Models/Complaints.js');
const TourGuideModel = require('../Models/TourGuide.js');
const DeleteRequestsModel = require('../Models/DeleteRequests.js');
const TransportationAdvertiserModel = require('../Models/TransportationAdvertiser.js');
const TransportationModel = require('../Models/Transportation.js');
const TagsModel = require('../Models/Tags.js');
const axios = require('axios');
const nodemailer = require('nodemailer'); 

const Stripe = require("stripe");
const stripe = Stripe('sk_test_51QLqHGP7Sjm96OcqEPPQmxSyVbLV9L7Rnj9v67b7lvTT37QGD1aUroGnGnpU4rm8a7CgNrTpNOalXtiXfwofP3pC00FSmMdarL');

const ItineraryModel = require('../Models/Itinerary.js');
const DeactivatedItinerariesModel = require('../Models/DeactivatedItineraries.js');
const AdvertiserModel = require('../Models/Advertiser.js');
const OrderCounterModel = require('../Models/OrderCounter.js'); 
const OrderModel = require('../Models/Orders.js');
const UserOTPModel = require('../Models/UserOTP.js');
const DeactivatedActivitiesModel = require('../Models/DeactivatedActivities.js');


const { default: mongoose } = require('mongoose');

const createTourist = async (req, res) => {
  // Destructure Email, Username, Password, MobileNumber, DoB, Nationality, Occupation from the request body
  const { Email, Username, Password, MobileNumber, DoB, Nationality, Occupation } = req.body;

  try {
      // Check if a user with the same Username already exists
      const existingUser = await AllUsernamesModel.findOne({ Username });
      if (existingUser) {
          return res.status(400).json({ error: "Username already exists!" });
      } else {
          await AllUsernamesModel.create({ Username });

          // Create a new user in the database with the provided details and initialize Wallet to 0
          const user = await TouristModel.create({
              Email,
              Username,
              Password,
              MobileNumber,
              DoB,
              Nationality,
              Occupation,
              Wallet: 0, // Initialize wallet to 0
              purchasedProducts: [], // Initialize purchasedProducts as an empty array
              BookedActivities:[],
              BookedItineraries:[],
              BookedMuseums:[],
              BookedHistPlaces:[],
              completedActivities:[],
              completedMuseumEvents:[],
              completedHistoricalPlaceEvent:[],
              completedItineraries: [],
              Points: 0,
              BadgeLevelOfPoints: 1,
              BookedFlights:[],
              BookedHotels:[],
              BookedTransportation:[],
              MyPreferences:[],
              BookmarkedEvents:[],
              WishList:[],
              Cart:[],
              DeliveryAddresses:[],
              Orders:[],
              Notifications:[],
          });

          // Send the created user as a JSON response with a 201 Created status
          res.status(201).json({ msg: "Tourist is created!", user });
      }
  } catch (error) {
      // If an error occurs, send a 400 Bad Request status with the error message
      res.status(400).json({ error: error.message });
  }
};


/*const getTourist = async (req, res) => {
   //retrieve all users from the database
   const{_id} = req.body;
   try{
      //add a new user to the database with Name, Email and Age
      const user = await TouristModel.findById({_id});
      //Send the created use as a JSON response with a 200 OK status 
      //res.status(200).json({msg:"user is created"});
      res.status(200).json(user);
   } catch (error){
      //If an error occurs, send a 400 Bad Request status with the error message
      res.status(400).json({ error: error.message});
   }
  }*/

  const getTourist = async (req, res) => {
   // Retrieve the Username from the request body
   const { Username } = req.query;
   try {
       // Find the tourist by Username
       const user = await TouristModel.findOne({ Username }); // Use findOne to search by Username

       // If no user is found, send a 404 response
       if (!user) {
           return res.status(404).json({ msg: "Tourist not found" });
       }

       // Send the found user as a JSON response with a 200 OK status
       res.status(200).json(user);
   } catch (error) {
       // If an error occurs, send a 400 Bad Request status with the error message
       res.status(400).json({ error: error.message });
   }
};

  
   /*const updateTourist = async (req, res) => {
      const { _id } = req.body;
      try {
        if (req.body.Username) {
          delete req.body.Username;
          return res.status(404).json({ msg: "Cannot update username" });
        }
        if (req.body.DoB) {
          delete req.body.DoB;
          return res.status(404).json({ msg: "Cannot update date of birth" });
        }
        if (req.body.Wallet) {
          delete req.body.Wallet;
          return res.status(404).json({ msg: "Cannot update wallet" });
        }
        const updatedTourist = await TouristModel.findByIdAndUpdate(_id, req.body, {
          new: true,            // Return the updated document
          runValidators: true,  // Ensure the updates respect schema validation rules
        });
        if (!updatedTourist) {
          return res.status(404).json({ msg: "Tourist not found" });
        }
        res.status(200).json(updatedTourist);
      } catch (error) {
        // Send a 400 error with the error message if something goes wrong
        res.status(400).json({ error: error.message });
      }
    };*/

    const updateTourist = async (req, res) => {
      const { Username } = req.body; 
      if (!Username) {
          return res.status(400).json({ msg: "Username is required" });
      }
      const updateFields = { ...req.body }; 
      if (updateFields.Username) {
          delete updateFields.Username;
      }
      if (updateFields.DoB) {
          delete updateFields.DoB;
          return res.status(404).json({ msg: "Cannot update date of birth " }); 
      }
      if (updateFields.Wallet) {
          delete updateFields.Wallet;
          return res.status(404).json({ msg: "Cannot update wallet " }); 
      }
      try {
          const updatedTourist = await TouristModel.findOneAndUpdate(
              { Username }, 
              updateFields, 
              {
                  new: true,            
                  runValidators: true,  
              }
          );
          if (!updatedTourist) {
              return res.status(404).json({ msg: "Tourist not found" });
          }
          res.status(200).json(updatedTourist);
      } catch (error) {
          // Send a 400 error with the error message if something goes wrong
          res.status(400).json({ error: error.message });
      }
  };

    
  

    
    
    /* const searchActivities = async (req, res) => {
      //retrieve all users from the database
      const{_id} = req.body;
      try{
      //add a new user to the database with Name, Email and Age
      const user = await TouristModel.find({});
      //Send the created use as a JSON response with a 200 OK status 
      //res.status(200).json({msg:"user is created"});
      res.status(200).json(user);
   } catch (error){
      //If an error occurs, send a 400 Bad Request status with the error message
      res.status(400).json({ error: error.message});
   }
  }*/

   /*const viewUpcomingEvents = async (req, res) => {
      try {
        const currentDate = new Date();  // Get the current date
    
        // Query to find documents where the date is greater than or equal to the current date
        const dateQuery = { date: { $gte: currentDate } };
    
        // Fetch upcoming activities, itineraries, and museums in parallel
        const [upcomingActivities, upcomingItineraries, upcomingMuseums] = await Promise.all([
          ActivityModel.find(dateQuery),   // Fetch activities with a future date
          ItineraryModel.find(dateQuery),  // Fetch itineraries with a future date
          MuseumModel.find(dateQuery)      // Fetch museums with a future date
        ]);
    
        // Combine results into a single response object
        const upcomingEvents = {
          activities: upcomingActivities,
          itineraries: upcomingItineraries,
          museums: upcomingMuseums
        };
    
        // Send the combined upcoming events as the response
        res.status(200).json(upcomingEvents);
      } catch (error) {
        // Handle any errors that occur during the fetch
        res.status(500).json({ error: error.message });
      }
    };*/
    
    /*const sortEvents = async (req, res) => {


    }*/

      
      /*const searchProductTourist = async (req, res) => {
         const {ProductName} = req.body;
         try {
             const fetchedProduct = await NewProduct.findOne({Name: ProductName}); //Fetch all categories
             res.status(200).json(fetchedProduct);
         } catch (error) {
            res.status(200).json({ msg: "There is no product with this name!" });
         }
      };*/

      const searchProductTourist = async (req, res) => {
        const { ProductName } = req.body; // Extract the product name from the request body
    
        // Validate the input
        if (!ProductName) {
            return res.status(400).json({ msg: "Product name is required." });
        }
    
        try {
            // Create a case-insensitive regex for product name matching
            const regex = new RegExp(ProductName, 'i'); // 'i' for case-insensitive matching
    
            // Construct the query to search for the product by name
            const query = { Name: regex };
    
            // Fetch the product based on the constructed query
            const fetchedProduct = await ProductModel.find(query);
    
            if (fetchedProduct.length === 0) {
                return res.status(404).json({ msg: "No product found for the given name!" });
            }
    
            res.status(200).json(fetchedProduct); // Respond with the fetched product(s)
        } catch (error) {
            console.error("Error fetching product:", error);
            res.status(500).json({ msg: "An error occurred while fetching the product." });
        }
    };
    

      /*const filterUpcomingActivities = async (req, res) => {
        const { category, price, date } = req.query; // Get filters from the request query
      
        // Create a base query for upcoming activities
        const query = {
          Date: { $gte: new Date() }, // Ensure the activities are upcoming
        };
      
        // Add filters to the query if they are provided
        if (category) {
          query.Category = category;
        }
      
        if (date) {
          query.Date = { $gte: new Date(date) }; // Filter for activities on or after the specified date
        }
      
        console.log('Query:', query); // Debugging: Log the constructed query
      
        try {
          const upcomingActivities = await ActivityModel.find(query).sort({ Date: 1 });
          res.status(200).json(upcomingActivities); // Send response with activities
        } catch (error) {
          console.error('Error fetching upcoming activities:', error);
          res.status(500).json({ message: 'Internal server error' }); // Send error response
        }
      };*/

      // const filterActivities = async (req, res) => {
      //   const { Category, Price, Date } = req.body; // Extract category and price from the request body
      //   const query = {}; // Initialize an empty query object
        
      //   if (Category) {
      //     query.Category = Category; 
      //   }
      //   if (Price) {
      //     query.Price = Price;
      //   }
      //   if (Date) {
      //     query.Date = Date; 
      //   }
      
      //   try {
      //     const fetchedActivities = await ActivityModel.find(query); // Fetch activities based on the constructed query
      //     if (fetchedActivities.length === 0) {
      //       return res.status(404).json({ msg: "No activities found for the given criteria!" });
      //     }
      //     res.status(200).json(fetchedActivities); // Respond with the fetched activities
      //   } catch (error) {
      //     console.error('Error fetching activities:', error);
      //     res.status(500).json({ msg: "An error occurred while fetching activities." });
      //   }
      // };

      const filterActivities = async (req, res) => {
        const { Category, minPrice, maxPrice, InputDate, Rating } = req.body; // Extract parameters from the request body
        const query = { flagged: false }; // Initialize query object to include `flagged: false`
    
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
    
    
    // Example Express.js route
    // app.post('/filter-activities', filterActivities);
    
    

      /*const filterHistoricalPlacesByTag = async (req, res) => {
        const { HistoricalTag } = req.body; // Extract the category from the request body
      
        try {
          const fetchedHistoricalTag = await MuseumModel.find({ HistoricalTag }); // Fetch activities by category
          if (fetchedActivities.length === 0) {
            return res.status(404).json({ msg: "No activities found for this category!" });
          }
          res.status(200).json(fetchedActivities); // Respond with the fetched activities
        } catch (error) {
          console.error('Error fetching activities:', error);
          res.status(500).json({ msg: "An error occurred while fetching activities." });
        }
      };*/

      /*const filterProductByPriceTourist = async (req, res) => {
        const { Price } = req.body; // Extract the category from the request body
      
        try {
          const fetchedProducts = await ProductModel.find({ Price }); // Fetch activities by category
          if (fetchedProducts.length === 0) {
            return res.status(404).json({ msg: "No product found with this price!" });
          }
          res.status(200).json(fetchedProducts); // Respond with the fetched activities
        } catch (error) {
          console.error('Error fetching products:', error);
          res.status(500).json({ msg: "An error occurred while fetching products." });
        }
      };*/

      const filterProductByPriceTourist = async (req, res) => { 
        const { MinimumPrice, MaximumPrice } = req.body; // Extract MinimumPrice and MaximumPrice from the request body
      
        // Build the query object dynamically based on the presence of MinimumPrice and MaximumPrice
        const priceQuery = {};
      
        if (MinimumPrice !== undefined) {
          priceQuery.$gte = MinimumPrice; // Add the condition for greater than or equal to MinimumPrice
        }
      
        if (MaximumPrice !== undefined) {
          priceQuery.$lte = MaximumPrice; // Add the condition for less than or equal to MaximumPrice
        }
      
        if (!MinimumPrice && !MaximumPrice) {
          return res.status(400).json({ msg: "Please provide either MinimumPrice or MaximumPrice." });
        }
      
        try {
          // Fetch products where price is within the specified range
          const fetchedProducts = await ProductModel.find({
            Price: priceQuery, // Apply the price query for filtering
          });
      
          if (fetchedProducts.length === 0) {
            return res.status(404).json({ msg: "No products found within the specified price range!" });
          }
      
          res.status(200).json(fetchedProducts); // Respond with the fetched products
        } catch (error) {
          console.error('Error fetching products:', error);
          res.status(500).json({ msg: "An error occurred while fetching products." });
        }
      };
      


      
      const ActivityRating = async (req, res) => {
        const { _id, Rating } = req.body; // Destructure _id and Rating from request body
      
        if (!_id || Rating === undefined) {
          return res.status(400).json({ message: 'Missing _id or Rating in the request body' });
        }
      
        try {
          // Find activity by id and update the rating
          const updatedRating = await ActivityModel.findByIdAndUpdate(
            _id,
            { Rating: Rating }, // Update the Rating field with the new value
            { new: true } // Option to return the updated document
          );
      
          if (!updatedRating) {
            return res.status(404).json({ message: 'Activity not found' }); // Send a 404 if activity is not found
          }
      
          return res.status(200).json({ message: 'Activity updated successfully', updatedRating });
        } catch (error) {
          console.error('Error updating activity rating:', error);
          return res.status(500).json({ message: 'Server error', error: error.message });
        }
      };

      const ProductRating = async (req, res) => {
        const { _id, Rating } = req.body; // Destructure _id and Rating from request body
      
        if (!_id || Rating === undefined) {
          return res.status(400).json({ message: 'Missing _id or Rating in the request body' });
        }
      
        try {
          // Find activity by id and update the rating
          const updatedRating = await ProductModel.findByIdAndUpdate(
            _id,
            { Ratings: Rating }, // Update the Rating field with the new value
            { new: true } // Option to return the updated document
          );
      
          if (!updatedRating) {
            return res.status(404).json({ message: 'Product not found' }); // Send a 404 if activity is not found
          }
      
          return res.status(200).json({ message: 'Product updated successfully', updatedRating });
        } catch (error) {
          console.error('Error updating Product rating:', error);
          return res.status(500).json({ message: 'Server error', error: error.message });
        }
      };

      const sortProductsDescendingTourist = async (req, res) => {
        try {
            // Fetch products sorted by ratings in descending order
            const products = await ProductModel.find().sort({ Ratings: -1 });
    
            // Respond with the sorted products
            res.status(200).json(products);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    };
    
    const sortProductsAscendingTourist = async (req, res) => {
        try {
            // Fetch products sorted by ratings in ascending order
            const products = await ProductModel.find().sort({ Ratings: 1 });
    
            // Respond with the sorted products
            res.status(200).json(products);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    };

    const ViewAllUpcomingActivities = async (req, res) => {
      try {
        // Get today's date and set the time to midnight
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); // Set to 00:00:00.000
    
        // Fetch all activities from the database
        const activities = await ActivityModel.find(); // Fetch all activities
    
        // Filter activities where the Date is greater than or equal to the current date
        const upcomingActivities = activities.filter(activity => {
          return (activity.Date >= currentDate  && activity.flagged === false); 
        });
        console.log(upcomingActivities);
    
        // Return the upcoming activities as a JSON response
        res.json(upcomingActivities);
      } catch (error) {
        console.error('Error fetching upcoming activities:', error);
        res.status(500).json({ message: 'Error fetching upcoming activities' });
      }
    };

    const ViewAllUpcomingMuseumEventsTourist = async (req, res) => {
      try {
        // Get today's date and set the time to midnight
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); // Set to 00:00:00.000
    
        // Fetch all activities from the database
        const museumEvents = await MuseumModel.find(); // Fetch all museums
    
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

    // const ViewAllUpcomingItinerariesTourist = async (req, res) => {
    //   try {
    //     // Get today's date and set the time to midnight
    //     const currentDate = new Date();
    //     currentDate.setHours(0, 0, 0, 0); 
    //     const itineraries = await ItineraryModel.find(); 
    //     const upcomingItineraries = itineraries.filter(itinerary => {
    //       return (itinerary.Date >= currentDate && itinerary.flagged === false);
    //     });
    
    //     // Return the upcoming activities as a JSON response
    //     res.json(upcomingItineraries);
    //   } catch (error) {
    //     console.error('Error fetching upcoming itinerary events:', error);
    //     res.status(500).json({ message: 'Error fetching upcoming itinerary events' });
    //   }
    // };
    
    const ViewAllUpcomingItinerariesTourist = async (req, res) => {
      try {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); // Set to 00:00:00.000
    
        // Fetch and filter itineraries directly in the query
        const upcomingItineraries = await ItineraryModel.find({
          Date: { $gte: currentDate },
          flagged: false,
        });
    
        res.json(upcomingItineraries);
      } catch (error) {
        console.error('Error fetching upcoming itinerary events:', error);
        res.status(500).json({ message: 'Error fetching upcoming itinerary events' });
      }
    };
    
    const ViewAllUpcomingHistoricalPlacesEventsTourist = async (req, res) => {
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

    const getMuseumsByTagTourist = async (req, res) => {
      try {
          // Extract the tags array from the request body
          const { tags } = req.body; // Expecting an array of tags
  
          // Get the current date
          const currentDate = new Date();
  
          // Find museums with any of the specified tags and dateOfEvent >= currentDate
          const museums = await MuseumModel.find({
              HistoricalTags: { $in: tags },
              dateOfEvent: { $gte: currentDate }, // Ensure dateOfEvent hasn't passed
          });
  
          // Check if any museums were found
          if (museums.length > 0) {
              res.status(200).json(museums);
          } else {
              res.status(404).json({ error: "No museums found with the specified tags and future dates." });
          }
      } catch (error) {
          res.status(400).json({ error: error.message });
      }
  };
  

  const getHistoricalPlacesByTagTourist = async (req, res) => {
    try {
        // Extract the tags array from the request body
        const { tags } = req.body; // Expecting an array of tags
  
        // Get the current date
        const currentDate = new Date();
  
        // Find historical places with the specified tags and upcoming events
        const historicalPlaces = await HistoricalPlacesModel.find({
            Tags: { $in: tags },
            dateOfEvent: { $gte: currentDate } // Filter for upcoming events
        });
  
        // Check if any historical places were found
        if (historicalPlaces.length > 0) {
            res.status(200).json(historicalPlaces);
        } else {
            res.status(404).json({ error: "No upcoming Historical Places found with the specified tags." });
        }
    } catch (error) {
        console.error("Error fetching Historical Places by tag:", error);
        res.status(400).json({ error: error.message });
    }
  };

const viewProductsTourist = async (req, res) => {
  try {
    const {Name} = req.body;  
    
    const products = await ProductModel.find({ Name: Name });

    if (!products.length) {
      return res.status(404).json({ error : "There is no product with this name" });
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const sortActivitiesPriceAscendingTourist = async (req, res) => {
  try {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Get all activities from the database where `flagged` is `false`
    const activities = await ActivityModel.find({ flagged: false });

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


const sortActivitiesPriceDescendingTourist = async (req, res) => {
  try {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Get all activities from the database
    const activities = await ActivityModel.find({ flagged: false });

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

const sortActivitiesRatingAscendingTourist = async (req, res) => {
  try {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Get all activities from the database
    const activities = await ActivityModel.find({ flagged: false });

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

const sortActivitiesRatingDescendingTourist = async (req, res) => {
  try {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Get all activities from the database
    const activities = await ActivityModel.find({ flagged: false });

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

const loginTourist = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required." });
    }

    // Find the advertiser by username
    const tourist = await TouristModel.findOne({ Username: username });
    if (!tourist) {
      return res.status(401).json({ error: "Invalid username." });
    }

    // Check if the password matches
    if (tourist.Password !== password) {
      return res.status(401).json({ error: "Invalid password." });
    }

    // Successful authentication
    res.status(200).json({ message: "Login successful!", tourist });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// const sortItinerariesPriceAscendingTourist = async (req, res) => {
//   try {
//     const currentDate = new Date();
//     currentDate.setHours(0, 0, 0, 0);

//     // Get all activities from the database
//     const itineraries = await ItineraryModel.find();

//     // Filter for upcoming activities only
//     const upcomingItineraries = itineraries.filter(itinerary => itinerary.Date >= currentDate);

//     // Sort the upcoming activities by price in ascending order
//     const sortedUpcomingItineraries = upcomingItineraries.sort((a, b) => a.Price - b.Price);

//     // Respond with the sorted activities
//     res.status(200).json(sortedUpcomingItineraries);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// const sortItinerariesPriceDescendingTourist = async (req, res) => {
//   try {
//     const currentDate = new Date();
//     currentDate.setHours(0, 0, 0, 0);

//     // Get all activities from the database
//     const itineraries = await ItineraryModel.find();

//     // Filter for upcoming activities only
//     const upcomingItineraries = itineraries.filter(itinerary => itinerary.Date >= currentDate);

//     // Sort the upcoming activities by price in descending order
//     const sortedUpcomingItineraries = upcomingItineraries.sort((a, b) => b.Price - a.Price);

//     // Respond with the sorted activities
//     res.status(200).json(sortedUpcomingItineraries);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

const sortItinerariesPriceAscendingTourist = async (req, res) => {
  try {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Get all itineraries from the database
    const itineraries = await ItineraryModel.find();

    // Filter for upcoming activities and exclude flagged itineraries
    const upcomingItineraries = itineraries.filter(itinerary => 
      itinerary.Date >= currentDate && itinerary.flagged !== true
    );

    // Sort the upcoming itineraries by price in ascending order
    const sortedUpcomingItineraries = upcomingItineraries.sort((a, b) => a.Price - b.Price);

    // Respond with the sorted itineraries
    res.status(200).json(sortedUpcomingItineraries);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const sortItinerariesPriceDescendingTourist = async (req, res) => {
  try {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Get all itineraries from the database
    const itineraries = await ItineraryModel.find();

    // Filter for upcoming activities and exclude flagged itineraries
    const upcomingItineraries = itineraries.filter(itinerary => 
      itinerary.Date >= currentDate && itinerary.flagged !== true
    );

    // Sort the upcoming itineraries by price in descending order
    const sortedUpcomingItineraries = upcomingItineraries.sort((a, b) => b.Price - a.Price);

    // Respond with the sorted itineraries
    res.status(200).json(sortedUpcomingItineraries);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// const filterItineraries = async (req, res) => {
//   const { minPrice, maxPrice, InputDate, Language, Tags } = req.body; // Extract 'Tags' from the request body
//   const query = {}; // Initialize an empty query object

//   // Get the current date and set time to midnight
//   const currentDate = new Date();
//   currentDate.setHours(0, 0, 0, 0);

//   // Date filtering logic
//   if (InputDate) {
//     const inputDate = new Date(InputDate);
//     inputDate.setHours(0, 0, 0, 0); // Normalize input date to midnight

//     if (inputDate < currentDate) {
//       return res.status(404).json({ msg: "Itinerary events with this date have passed!" });
//     } else {
//       query.Date = inputDate; // Set query to look for this specific date
//     }
//   } else {
//     query.Date = { $gte: currentDate }; // Only include activities on or after the current date
//   }

//   // Filter by Language if provided
//   if (Language) {
//     query.Language = Language;
//   }

//   // Price filtering logic
//   if (minPrice !== undefined && maxPrice !== undefined) {
//     query.Price = { $gte: minPrice, $lte: maxPrice };
//   } else if (minPrice !== undefined) {
//     query.Price = { $gte: minPrice };
//   } else if (maxPrice !== undefined) {
//     query.Price = { $lte: maxPrice };
//   }

//   // Filter by Tags if provided
//   if (Tags && Tags.length > 0) {
//     query.Tags = { $in: Tags }; // Match any of the provided tags
//   }

//   try {
//     const fetchedItineraries = await ItineraryModel.find(query); // Fetch itineraries based on the constructed query
//     if (fetchedItineraries.length === 0) {
//       return res.status(404).json({ msg: "No itineraries found for the given criteria!" });
//     }
//     res.status(200).json(fetchedItineraries); // Respond with the fetched itineraries
//   } catch (error) {
//     console.error('Error fetching itineraries:', error);
//     res.status(500).json({ msg: "An error occurred while fetching itineraries." });
//   }
// };


const filterItinerariesTourist = async (req, res) => {
  const { MinPrice, maxPrice, InputDate, Language, Tags } = req.body; // Extract parameters from the request body
  const query = {}; // Initialize an empty query object

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
  if (MinPrice !== undefined && maxPrice !== undefined) {
      // Both minPrice and maxPrice are provided
      query.Price = {
          $gte: MinPrice, // Greater than or equal to minPrice
          $lte: maxPrice  // Less than or equal to maxPrice
      };
  } else if (MinPrice !== undefined) {
      // Only minPrice is provided
      query.Price = { $gte: MinPrice }; 
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


// Example Express.js route
// app.post('/filter-itineraries', filterItinerariesTourist);


      /*const ActivitiesSearchAll = async (req, res) => {
        const { searchString } = req.body; // Extract the search string from the request body
        const query = {}; // Initialize an empty query object
    
        // Create a case-insensitive regex if a search string is provided
        if (searchString) {
            const regex = new RegExp(searchString, 'i'); // 'i' for case-insensitive matching
    
            // Construct the query to search across the Name, Category, and Tags fields
            query.$or = [
                { Name: regex },
                { Category: regex },
                { Tags: { $in: [searchString] } } // For Tags, match any tag that equals the search string
            ];
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
    };*/

    const ActivitiesSearchAll = async (req, res) => {
      const { searchString } = req.body; // Extract the search string from the request body
      const query = {
          flagged: false, // Exclude flagged activities
          Date: { $gte: new Date() }, // Include only upcoming activities
      }; // Initialize the query object with base filters
      
      // Create a case-insensitive regex if a search string is provided
      if (searchString) {
          const regex = new RegExp(searchString, 'i'); // 'i' for case-insensitive matching
          
          // Add search criteria to the query
          query.$or = [
              { Name: regex },
              { Category: regex },
              { Tags: { $in: [searchString] } }, // Match if the tag equals the search string
          ];
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
  
  const ItinerarySearchAll = async (req, res) => {
    const { searchString } = req.body; // Extract the search string from the request body
    const query = {
        Date: { $gte: new Date() }, // Ensure the itinerary date has not passed
        flagged: false, // Only include itineraries where flagged is false
    };

    // Create a case-insensitive regex if a search string is provided
    if (searchString) {
        const regex = new RegExp(searchString, 'i'); // 'i' for case-insensitive matching

        // Add search conditions for Title and Tags
        query.$or = [
            { Title: regex },
            { Tags: { $in: [searchString] } }, // For Tags, match any tag that equals the search string
        ];
    }

    try {
        const fetchedItineraries = await ItineraryModel.find(query); // Fetch itineraries based on the constructed query
        if (fetchedItineraries.length === 0) {
            return res.status(404).json({ msg: "No itineraries found for the given criteria!" });
        }
        res.status(200).json(fetchedItineraries); // Respond with the fetched itineraries
    } catch (error) {
        console.error('Error fetching itineraries:', error);
        res.status(500).json({ msg: "An error occurred while fetching itineraries." });
    }
};

  /*const MuseumSearchAll = async (req, res) => {
    const { searchString } = req.body; // Extract the search string from the request body
    const query = {}; // Initialize an empty query object

    // Create a case-insensitive regex if a search string is provided
    if (searchString) {
        const regex = new RegExp(searchString, 'i'); // 'i' for case-insensitive matching

        // Construct the query to search across the Name, Category, and Tags fields
        query.$or = [
            { name: regex },
            { HistoricalTags: { $in: [searchString] } } // For Tags, match any tag that equals the search string
        ];
    }

    try {
        const fetchedMuseums= await MuseumModel.find(query); // Fetch activities based on the constructed query
        if (fetchedMuseums.length === 0) {
            return res.status(404).json({ msg: "No museums found for the given criteria!" });
        }
        res.status(200).json(fetchedMuseums); // Respond with the fetched activities
    } catch (error) {
        console.error('Error fetching museums:', error);
        res.status(500).json({ msg: "An error occurred while fetching museums." });
    }
};*/
const MuseumSearchAll = async (req, res) => {
  const { searchString } = req.body; // Extract the search string from the request body
  const currentDate = new Date(); // Get the current date

  const query = { dateOfEvent: { $gte: currentDate } }; // Filter for upcoming events only

  // Create a case-insensitive regex if a search string is provided
  if (searchString) {
      const regex = new RegExp(searchString, 'i'); // 'i' for case-insensitive matching

      // Construct the query to search across the Name, Category, and Tags fields
      query.$or = [
          { name: regex },
          { HistoricalTags: { $in: [searchString] } } // For Tags, match any tag that equals the search string
      ];
  }

  try {
      const fetchedMuseums = await MuseumModel.find(query); // Fetch museums based on the constructed query
      if (fetchedMuseums.length === 0) {
          return res.status(404).json({ msg: "No museums found for the given criteria!" });
      }
      res.status(200).json(fetchedMuseums); // Respond with the fetched museums
  } catch (error) {
      console.error('Error fetching museums:', error);
      res.status(500).json({ msg: "An error occurred while fetching museums." });
  }
};


/*const HistoricalPlacesSearchAll = async (req, res) => {
  const { searchString } = req.body; // Extract the search string from the request body
  const query = {}; // Initialize an empty query object

  // Create a case-insensitive regex if a search string is provided
  if (searchString) {
      const regex = new RegExp(searchString, 'i'); // 'i' for case-insensitive matching

      // Construct the query to search across the Name, Category, and Tags fields
      query.$or = [
          { name: regex },
          { Tags: { $in: [searchString] } } // For Tags, match any tag that equals the search string
      ];
  }

  try {
      const fetchedHistoricalPlaces= await HistoricalPlacesModel.find(query); // Fetch activities based on the constructed query
      if (fetchedHistoricalPlaces.length === 0) {
          return res.status(404).json({ msg: "No Historical Places found for the given criteria!" });
      }
      res.status(200).json(fetchedHistoricalPlaces); // Respond with the fetched activities
  } catch (error) {
      console.error('Error fetching Historical Places:', error);
      res.status(500).json({ msg: "An error occurred while fetching Historical Places." });
  }
};
*/

const HistoricalPlacesSearchAll = async (req, res) => {
  const { searchString } = req.body; // Extract the search string from the request body
  const query = {}; // Initialize an empty query object

  // Get the current date
  const currentDate = new Date();

  // Create a case-insensitive regex if a search string is provided
  if (searchString) {
    const regex = new RegExp(searchString, 'i'); // 'i' for case-insensitive matching

    // Construct the query to search across the Name, Category, and Tags fields
    query.$or = [
      { name: regex },
      { Tags: { $in: [searchString] } } // For Tags, match any tag that equals the search string
    ];
  }

  // Add a condition to only fetch upcoming events
  query.dateOfEvent = { $gte: currentDate };

  try {
    const fetchedHistoricalPlaces = await HistoricalPlacesModel.find(query); // Fetch activities based on the constructed query
    if (fetchedHistoricalPlaces.length === 0) {
      return res.status(404).json({ msg: "No upcoming Historical Places found for the given criteria!" });
    }
    res.status(200).json(fetchedHistoricalPlaces); // Respond with the fetched activities
  } catch (error) {
    console.error('Error fetching Historical Places:', error);
    res.status(500).json({ msg: "An error occurred while fetching Historical Places." });
  }
};

const createComplaint = async (req, res) => {
  const { Title, Body, TouristUsername } = req.body;

  try {
      // Create a new complaint object
      const newComplaint = new ComplaintsModel({
          Title: Title,
          Body: Body,
          Date: new Date(),
          Status: 'Pending',
          TouristUsername: TouristUsername
      });

      await newComplaint.save();

      res.status(201).json({ msg: "Complaint created successfully!", complaint: newComplaint });
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
};

const getComplaintsByTouristUsername = async (req, res) => {
  const { TouristUsername } = req.query;

  try {
      const complaints = await ComplaintsModel.find({ TouristUsername:  TouristUsername});
      if (complaints.length === 0) {
          return res.status(404).json({ error: "You haven't filed any complaints!" });
      }
      res.status(200).json(complaints);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
};

const ChooseActivitiesByCategoryTourist = async (req, res) => {
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



const bookActivity = async (req, res) => {
  const { touristUsername, activityName } = req.body;

  try {
    
    const activity = await ActivityModel.findOne({ Name: activityName });
    
    if (!activity) {
      return res.status(404).json({ msg: 'Activity not found' });
    }

    
    const tourist = await TouristModel.findOne({ Username: touristUsername });
    
    if (!tourist) {
      return res.status(404).json({ msg: 'Tourist not found' });
    }

    //tourist's age
    const today = new Date();
    const birthDate = new Date(tourist.DoB);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    
    if (age < 18) {
      return res.status(403).json({ msg: 'You must be 18 or older to book an activity.' });
    }

    
    if (!tourist.BookedActivities) {
      tourist.BookedActivities = [];
    }

    res.status(201).json({ msg: 'Activity booked successfully!', activityName: activity.Name, totalCost: activity.Price});
  } catch (error) {
    console.error('Error booking activity:', error);
    res.status(500).json({ error: error.message });
  }
};



const bookItinerary = async (req, res) => {
  const { touristUsername, itineraryName } = req.body;

  try {
    const itinerary = await ItineraryModel.findOne({ Title: itineraryName });
    
    if (!itinerary) {
      return res.status(404).json({ msg: 'Itinerary not found' });
    }

    const tourist = await TouristModel.findOne({ Username: touristUsername });
    
    if (!tourist) {
      return res.status(404).json({ msg: 'Tourist not found' });
    }

    const today = new Date();
    const birthDate = new Date(tourist.DoB);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 18) {
      return res.status(403).json({ msg: 'You must be 18 or older to book an itinerary.' });
    }

   
    if (!tourist.BookedItineraries) {
      tourist.BookedItineraries = [];
    }

    
    await tourist.save();

    // Respond with success
    res.status(201).json({ msg: 'Itinerary booked successfully!', itineraryName: itinerary.Title, totalCost: itinerary.Price });
  } catch (error) {
    console.error('Error booking itinerary:', error);
    res.status(500).json({ error: error.message });
  }
};

const bookMuseum = async (req, res) => {
  const { touristUsername, museumName } = req.body;

  try {
    const museum = await MuseumModel.findOne({ name: museumName });
    if (!museum) {
      return res.status(404).json({ msg: 'Museum not found' });
    }
    
    if (!museum.dateOfEvent || museum.dateOfEvent === null) {
      return res.status(404).json({ msg: 'No events for this museum' });;
      // You can add further logic based on the dateOfEvent if needed
    } 
    const tourist = await TouristModel.findOne({ Username: touristUsername });
    
    if (!tourist) {
      return res.status(404).json({ msg: 'Tourist not found' });
    }

    const today = new Date();
    const birthDate = new Date(tourist.DoB);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 18) {
      return res.status(403).json({ msg: 'You must be 18 or older to book a museum.' });
    }

    let ticketPrice;
    if (tourist.Occupation.toLowerCase() === 'student') {
      ticketPrice = museum.ticketPrices.student;
    } else if (tourist.Nationality.toLowerCase() === 'egyptian') {
      ticketPrice = museum.ticketPrices.native;
    } else {
      ticketPrice = museum.ticketPrices.foreigner;
    }

    if (!tourist.BookedMuseums) {
      tourist.BookedMuseums = [];
    }

    await tourist.save();

    res.status(201).json({ msg: 'Museum booked successfully!', museumName: museum.name, ticketPrice });
  } catch (error) {
    console.error('Error booking museum:', error);
    res.status(500).json({ error: error.message });
  }
};

const bookHistoricalPlace = async (req, res) => {
  const { touristUsername, historicalPlaceName } = req.body;

  try {
    const historicalPlace = await HistoricalPlacesModel.findOne({ name: historicalPlaceName });
    
    if (!historicalPlace) {
      return res.status(404).json({ msg: 'Historical Place not found' });
    }
     
    if (!historicalPlace.dateOfEvent || historicalPlace.dateOfEvent === null) {
      return res.status(404).json({ msg: 'No events for this historical plae' });;
      // You can add further logic based on the dateOfEvent if needed
    } 
    const tourist = await TouristModel.findOne({ Username: touristUsername });
    
    if (!tourist) {
      return res.status(404).json({ msg: 'Tourist not found' });
    }

    const today = new Date();
    const birthDate = new Date(tourist.DoB);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 18) {
      return res.status(403).json({ msg: 'You must be 18 or older to book a historical place.' });
    }

    let ticketPrice;
    if (tourist.Occupation.toLowerCase() === 'student') {
      ticketPrice = historicalPlace.ticketPrices.student;
    } else if (tourist.Nationality.toLowerCase() === 'egyptian') {
      ticketPrice = historicalPlace.ticketPrices.native;
    } else {
      ticketPrice = historicalPlace.ticketPrices.foreigner;
    }

    if (!tourist.BookedHistPlaces) {
      tourist.BookedHistPlaces = [];
    }

    

    await tourist.save();

    res.status(201).json({ msg: 'Historical Place booked successfully!', historicalPlaceName: historicalPlace.name, ticketPrice });
  } catch (error) {
    console.error('Error booking historical place:', error);
    res.status(500).json({ error: error.message });
  }
};

// const addPurchasedProducts = async (req, res) => {
//   const { touristUsername, productNames } = req.body; // Expecting an array of product names

//   try {
//     // Find the tourist by username
//     const tourist = await TouristModel.findOne({ Username: touristUsername });
//     if (!tourist) {
//       return res.status(404).json({ msg: 'Tourist not found' });
//     }

//     // Check if productNames is an array
//     if (!Array.isArray(productNames)) {
//       return res.status(400).json({ msg: 'Product names must be provided as an array' });
//     }

//     // Loop through the product names and add them to purchasedProducts
//     productNames.forEach(productName => {
//       // Check if the product is already in the purchasedProducts
//       const existingProduct = tourist.purchasedProducts.find(p => p.Name === productName);
//       if (!existingProduct) {
//         tourist.purchasedProducts.push({ productName }); // Add product name without rating
//       }
//     });

//     // Save the updated tourist document
//     await tourist.save();

//     // Send a response with the updated tourist data
//     res.status(200).json({ msg: 'Purchased products added successfully!', purchasedProducts: tourist.purchasedProducts });
//   } catch (error) {
//     console.error('Error adding purchased products:', error);
//     res.status(500).json({ error: error.message });
//   }
// };



const ratePurchasedProduct = async (req, res) => {
  const { touristUsername, productName, rating } = req.body;

  try {
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ msg: 'Rating must be between 1 and 5' });
    }
    const tourist = await TouristModel.findOne({ Username: touristUsername });
    if (!tourist) {
      return res.status(404).json({ msg: 'Tourist not found' });
    }
    const product = await ProductModel.findOne({ Name: productName });
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    if (!tourist.purchasedProducts) {
      tourist.purchasedProducts = [];
    }
    const purchasedProduct = tourist.purchasedProducts.find(p => p.productName === productName);
    if (!purchasedProduct) {
      return res.status(400).json({ msg: 'You have not purchased this product.' });
    }
    purchasedProduct.rating = rating;
    await tourist.save();

    const previousRating = product.Ratings || 0; 
    const ratingCount = (product.RatingCount || 0) + 1; 
    const newAverageRating = ((previousRating * (ratingCount - 1)) + rating) / ratingCount;

    product.Ratings = newAverageRating;
    product.RatingCount = ratingCount; 
    await product.save();

    res.status(200).json({ msg: 'Product rated successfully!', productName, newAverageRating });
  } catch (error) {
    console.error('Error rating product:', error);
    res.status(500).json({ error: error.message });
  }
};

const reviewPurchasedProduct = async (req, res) => {
  const { touristUsername, productName, review } = req.body;

  try {
    // Validate review
    if (!review || review.trim().length === 0) {
      return res.status(400).json({ msg: 'Review cannot be empty' });
    }

    // Find the tourist by username
    const tourist = await TouristModel.findOne({ Username: touristUsername });
    if (!tourist) {
      return res.status(404).json({ msg: 'Tourist not found' });
    }

    // Check if the product exists in purchasedProducts
    const purchasedProduct = tourist.purchasedProducts.find(p => p.productName === productName);
    if (!purchasedProduct) {
      return res.status(400).json({ msg: 'You have not purchased this product.' });
    }

    // Find the product to update its reviews
    const product = await ProductModel.findOne({ Name: productName });
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    // Add the review to the product's Reviews array
    product.Reviews.push({ touristUsername: touristUsername, Review: review });
    await product.save();

  

    res.status(200).json({ msg: 'Review added successfully!', productName, review });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ error: error.message });
  }
};




const addCompletedItinerary = async (req, res) => {
  const { touristUsername } = req.body;

  try {
    // Find the tourist by username
    const tourist = await TouristModel.findOne({ Username: touristUsername });
    if (!tourist) {
      return res.status(404).json({ msg: 'Tourist not found' });
    }

    const currentDate = new Date();
    
    // Iterate over the bookedItineraries array and check if the date has passed
    const updatedBookedItineraries = [];
    for (const bookedItinerary of tourist.BookedItineraries) {
      const itinerary = await ItineraryModel.findOne({ Title: bookedItinerary.ItineraryName });
      if (itinerary && itinerary.Date <= currentDate) {
        // Move to completedItineraries if the date has passed
        tourist.completedItineraries.push(bookedItinerary);
      } else {
        // Retain the itinerary if the date hasn't passed
        updatedBookedItineraries.push(bookedItinerary);
      }
    }

    // Update the tourist's bookedItineraries array
    tourist.BookedItineraries = updatedBookedItineraries;

    // Save the updated tourist document
    await tourist.save();

    // Send a response with the updated tourist data
    res.status(200).json({
      msg: 'Itineraries updated successfully!',
      completedItineraries: tourist.completedItineraries,
      bookedItineraries: tourist.BookedItineraries
    });
  } catch (error) {
    console.error('Error updating completed itineraries:', error);
    res.status(500).json({ error: error.message });
  }
};


const addCompletedActivities = async (req, res) => {
  const { touristUsername } = req.body;

  try {
    // Find the tourist by username
    const tourist = await TouristModel.findOne({ Username: touristUsername });
    if (!tourist) {
      return res.status(404).json({ msg: 'Tourist not found' });
    }

    const currentDate = new Date();
    
    // Iterate over the bookedActivities array and check if the date has passed
    const updatedBookedActivities = [];
    for (const bookedActivity of tourist.BookedActivities) {
      const activity = await ActivityModel.findOne({ Name: bookedActivity.activityName });
      if (activity && activity.Date <= currentDate) {
        // Ensure the correct structure is pushed to completedActivities
        tourist.completedActivities.push({
          ActivityName: bookedActivity.activityName
        });
      } else {
        // Retain the activity if the date hasn't passed
        updatedBookedActivities.push(bookedActivity);
      }
    }

    // Update the tourist's bookedActivities array
    tourist.BookedActivities = updatedBookedActivities;

    // Save the updated tourist document
    await tourist.save();

    // Send a response with the updated tourist data
    res.status(200).json({
      msg: 'Activities updated successfully!',
      completedActivities: tourist.completedActivities,
      bookedActivities: tourist.BookedActivities
    });
  } catch (error) {
    console.error('Error updating completed activities:', error);
    res.status(500).json({ error: error.message });
  }
};



const addCompletedMuseumEvents = async (req, res) => {
  const { touristUsername } = req.body;

  try {
    // Find the tourist by username
    const tourist = await TouristModel.findOne({ Username: touristUsername });
    if (!tourist) {
      return res.status(404).json({ msg: 'Tourist not found' });
    }

    const currentDate = new Date();

    // Iterate over the BookedMuseums array and check if the event date has passed
    const updatedBookedMuseums = [];
    for (const bookedMuseum of tourist.BookedMuseums) {
      const museumEvent = await MuseumModel.findOne({ name: bookedMuseum.MuseumName });
      if (museumEvent && museumEvent.dateOfEvent <= currentDate) {
        // Move to completedMuseumEvents if the event date has passed
        tourist.completedMuseumEvents.push({
          MuseumName: bookedMuseum.MuseumName // Add other required fields if necessary
        });
      } else {
        // Retain the museum in BookedMuseums if the event date hasn't passed
        updatedBookedMuseums.push(bookedMuseum);
      }
    }

    // Update the tourist's BookedMuseums array
    tourist.BookedMuseums = updatedBookedMuseums;

    // Save the updated tourist document
    await tourist.save();

    // Send a response with the updated tourist data
    res.status(200).json({
      msg: 'Museum events updated successfully!',
      completedMuseumEvents: tourist.completedMuseumEvents,
      bookedMuseums: tourist.BookedMuseums
    });
  } catch (error) {
    console.error('Error updating completed museum events:', error);
    res.status(500).json({ error: error.message });
  }
};


const addCompletedHPEvents = async (req, res) => {
  const { touristUsername } = req.body;

  try {
    // Find the tourist by username
    const tourist = await TouristModel.findOne({ Username: touristUsername });
    if (!tourist) {
      return res.status(404).json({ msg: 'Tourist not found' });
    }

    const currentDate = new Date();

    // Iterate over the BookedHistPlaces array and check if the event date has passed
    const updatedBookedHistPlaces = [];
    for (const bookedHP of tourist.BookedHistPlaces) {
      const hpEvent = await HistoricalPlacesModel.findOne({ name: bookedHP.HistPlaceName });
      if (hpEvent && hpEvent.dateOfEvent <= currentDate) {
        // Move to completedHistoricalPlaceEvent if the event date has passed
        tourist.completedHistoricalPlaceEvent.push({
          HistoricalPlaceName: bookedHP.HistPlaceName
        });
      } else {
        // Retain the historical place in BookedHistPlaces if the event date hasn't passed
        updatedBookedHistPlaces.push(bookedHP);
      }
    }

    // Update the tourist's BookedHistPlaces array
    tourist.BookedHistPlaces = updatedBookedHistPlaces;

    // Save the updated tourist document
    await tourist.save();

    // Send a response with the updated tourist data
    res.status(200).json({
      msg: 'Historical Place events updated successfully!',
      completedHistoricalPlaceEvent: tourist.completedHistoricalPlaceEvent,
      bookedHistPlaces: tourist.BookedHistPlaces
    });
  } catch (error) {
    console.error('Error updating completed Historical Place events:', error);
    res.status(500).json({ error: error.message });
  }
};


const rateTourGuide = async (req, res) => {
  const { touristUsername, itineraryName, rating } = req.body;

  try {
    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ msg: 'Rating must be between 1 and 5' });
    }

    // Find the tourist by username
    const tourist = await TouristModel.findOne({ Username: touristUsername });
    if (!tourist) {
      return res.status(404).json({ msg: 'Tourist not found' });
    }

    // Find the completed itinerary
    const completedItinerary = tourist.completedItineraries.find(it => it.ItineraryName === itineraryName);
    if (!completedItinerary) {
      return res.status(400).json({ msg: 'You must complete the itinerary before rating' });
    }

    // Get the itinerary and the AuthorUsername
    const itinerary = await ItineraryModel.findOne({ Title: itineraryName });
    if (!itinerary) {
      return res.status(404).json({ msg: 'Itinerary not found' });
    }
    
    const authorUsername = itinerary.AuthorUsername;

    // Find the tour guide by username
    const tourGuide = await TourGuideModel.findOne({ Username: authorUsername });
    if (!tourGuide) {
      return res.status(404).json({ msg: 'Tour guide not found' });
    }

    // Calculate new average rating
    const previousRating = tourGuide.Rating || 0; 
    const ratingCount = tourGuide.RatingCount + 1; // Increment rating count
    const newAverageRating = ((previousRating * tourGuide.RatingCount) + rating) / ratingCount;

    // Update tour guide's ratings
    tourGuide.Rating = newAverageRating; // Update average rating
    tourGuide.RatingCount = ratingCount; // Update rating count
    await tourGuide.save();

    res.status(200).json({ msg: 'Tour guide rated successfully!', newAverageRating });
  } catch (error) {
    console.error('Error rating tour guide:', error);
    res.status(500).json({ error: error.message });
  }
};

const commentOnTourGuide = async (req, res) => {
  const { touristUsername, itineraryName, comment } = req.body;

  try {
    // Validate comment
    if (!comment || comment.trim().length === 0) {
      return res.status(400).json({ msg: 'Comment cannot be empty' });
    }

    // Find the tourist by username
    const tourist = await TouristModel.findOne({ Username: touristUsername });
    if (!tourist) {
      return res.status(404).json({ msg: 'Tourist not found' });
    }

    // Find the completed itinerary
    const completedItinerary = tourist.completedItineraries.find(it => it.ItineraryName === itineraryName);
    if (!completedItinerary) {
      return res.status(400).json({ msg: 'You must complete the itinerary before commenting' });
    }

    // Get the itinerary and the AuthorUsername
    const itinerary = await ItineraryModel.findOne({ Title: itineraryName });
    if (!itinerary) {
      return res.status(404).json({ msg: 'Itinerary not found' });
    }
    
    const authorUsername = itinerary.AuthorUsername;

    // Find the tour guide by username
    const tourGuide = await TourGuideModel.findOne({ Username: authorUsername });
    if (!tourGuide) {
      return res.status(404).json({ msg: 'Tour guide not found' });
    }

    // Add the comment to the tour guide's comments array
    tourGuide.Comments.push({ TouristUsername: touristUsername, Comment: comment });
    await tourGuide.save();

    res.status(200).json({ msg: 'Comment added successfully!', comments: tourGuide.Comments });
  } catch (error) {
    console.error('Error commenting on tour guide:', error);
    res.status(500).json({ error: error.message });
  }
};

const rateCompletedItinerary = async (req, res) => {
  const { touristUsername, itineraryName, rating } = req.body;

  try {
    // Validate the rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ msg: 'Rating must be between 1 and 5' });
    }

    // Find the tourist by username
    const tourist = await TouristModel.findOne({ Username: touristUsername });
    if (!tourist) {
      return res.status(404).json({ msg: 'Tourist not found' });
    }

    // Find the completed itinerary
    const completedItinerary = tourist.completedItineraries.find(it => it.ItineraryName === itineraryName);
    if (!completedItinerary) {
      return res.status(400).json({ msg: 'You must complete the itinerary before rating' });
    }

    
    const itinerary = await ItineraryModel.findOne({ Title: itineraryName });
    if (!itinerary) {
      return res.status(404).json({ msg: 'Itinerary not found' });
    }

    // Update the rating in the completed itinerary
    completedItinerary.rating = rating;

    // Save the tourist model
    await tourist.save();

    // Update the itinerary's ratings
    const previousRating = itinerary.Ratings || 0;
    const ratingCount = (itinerary.RatingCount || 0) + 1;
    const newAverageRating = ((previousRating * (ratingCount - 1)) + rating) / ratingCount;

    itinerary.Ratings = newAverageRating;
    itinerary.RatingCount = ratingCount;
    await itinerary.save();

    res.status(200).json({ msg: 'Itinerary rated successfully!', itineraryName, newAverageRating });
  } catch (error) {
    console.error('Error rating itinerary:', error);
    res.status(500).json({ error: error.message });
  }
};

const commentOnItinerary = async (req, res) => {
  const { touristUsername, itineraryName, comment } = req.body;

  try {
    // Validate comment
    if (!comment || comment.trim().length === 0) {
      return res.status(400).json({ msg: 'Comment cannot be empty' });
    }

    // Find the tourist by username
    const tourist = await TouristModel.findOne({ Username: touristUsername });
    if (!tourist) {
      return res.status(404).json({ msg: 'Tourist not found' });
    }

    const completedItinerary = tourist.completedItineraries.find(it => it.ItineraryName === itineraryName);
    if (!completedItinerary) {
      return res.status(400).json({ msg: 'You must complete the itinerary before rating' });
    }

    // Find the itinerary
    const itinerary = await ItineraryModel.findOne({ Title: itineraryName });
    if (!itinerary) {
      return res.status(404).json({ msg: 'Itinerary not found' });
    }

    // Add the comment to the itinerary's Comments array
    itinerary.Comments.push({ touristUsername, Comment: comment });
    await itinerary.save();

    res.status(200).json({ msg: 'Comment added successfully!', comments: itinerary.Comments });
  } catch (error) {
    console.error('Error commenting on itinerary:', error);
    res.status(500).json({ error: error.message });
  }
};

const rateCompletedActivity = async (req, res) => {
  const { touristUsername, activityName, rating } = req.body;

  try {
    // Validate the rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ msg: 'Rating must be between 1 and 5' });
    }

    // Find the tourist by username
    const tourist = await TouristModel.findOne({ Username: touristUsername });
    if (!tourist) {
      return res.status(404).json({ msg: 'Tourist not found' });
    }

    // Find the completed itinerary
    const completedActivity = tourist.completedActivities.find(ac => ac.ActivityName === activityName);
    if (!completedActivity) {
      return res.status(400).json({ msg: 'You must complete the activity before rating' });
    }

    
    const activity = await ActivityModel.findOne({ Name: activityName });
    if (!activity) {
      return res.status(404).json({ msg: 'activity not found' });
    }

    // Update the rating in the completed itinerary
    completedActivity.rating = rating;

    // Save the tourist model
    await tourist.save();

    // Update the itinerary's ratings
    const previousRating = activity.Rating || 0;
    const ratingCount = (activity.RatingCount || 0) + 1;
    const newAverageRating = ((previousRating * (ratingCount - 1)) + rating) / ratingCount;

    activity.Rating = newAverageRating;
    activity.RatingCount = ratingCount;
    await activity.save();

    res.status(200).json({ msg: 'activity rated successfully!', activityName, newAverageRating });
  } catch (error) {
    console.error('Error rating itinerary:', error);
    res.status(500).json({ error: error.message });
  }
};


const rateCompletedMuseum = async (req, res) => {
  const { touristUsername, museumName, rating } = req.body;

  try {
    // Validate the rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ msg: 'Rating must be between 1 and 5' });
    }

    // Find the tourist by username
    const tourist = await TouristModel.findOne({ Username: touristUsername });
    if (!tourist) {
      return res.status(404).json({ msg: 'Tourist not found' });
    }

    // Find the completed itinerary
    const completedMuseum = tourist.completedMuseumEvents.find(ac => ac.MuseumName === museumName);
    if (!completedMuseum) {
      return res.status(400).json({ msg: 'You must complete the museum event before rating' });
    }

    
    const museum = await MuseumModel.findOne({ name: museumName });
    if (!museum) {
      return res.status(404).json({ msg: 'museum not found' });
    }

    // Update the rating in the completed itinerary
    completedMuseum.Ratings = rating;

    // Save the tourist model
    await tourist.save();

    // Update the itinerary's ratings
    const previousRating = museum.Ratings || 0;
    const ratingCount = (museum.RatingCount || 0) + 1;
    const newAverageRating = ((previousRating * (ratingCount - 1)) + rating) / ratingCount;

    museum.Ratings = newAverageRating;
    museum.RatingCount = ratingCount;
    await museum.save();

    res.status(200).json({ msg: 'museum rated successfully!', museumName, newAverageRating });
  } catch (error) {
    console.error('Error rating museum:', error);
    res.status(500).json({ error: error.message });
  }
};

const rateCompletedHP = async (req, res) => {
  const { touristUsername, HPname, rating } = req.body;

  try {
    // Validate the rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ msg: 'Rating must be between 1 and 5' });
    }

    // Find the tourist by username
    const tourist = await TouristModel.findOne({ Username: touristUsername });
    if (!tourist) {
      return res.status(404).json({ msg: 'Tourist not found' });
    }

    // Find the completed itinerary
    const completedHP = tourist.completedHistoricalPlaceEvent.find(ac => ac.HistoricalPlaceName === HPname);
    if (!completedHP) {
      return res.status(400).json({ msg: 'You must complete the historical place event before rating' });
    }

    
    const hp = await HistoricalPlacesModel.findOne({ name: HPname });
    if (!hp) {
      return res.status(404).json({ msg: 'hp not found' });
    }

    // Update the rating in the completed itinerary
    completedHP.Ratings = rating;

    // Save the tourist model
    await tourist.save();

    // Update the itinerary's ratings
    const previousRating = hp.Ratings || 0;
    const ratingCount = (hp.RatingCount || 0) + 1;
    const newAverageRating = ((previousRating * (ratingCount - 1)) + rating) / ratingCount;

    hp.Ratings = newAverageRating;
    hp.RatingCount = ratingCount;
    await hp.save();

    res.status(200).json({ msg: 'hp rated successfully!', HPname, newAverageRating });
  } catch (error) {
    console.error('Error rating hp:', error);
    res.status(500).json({ error: error.message });
  }
};

const commentOnActivity = async (req, res) => {
  const { touristUsername, activityName, comment } = req.body;

  try {
    // Validate comment
    if (!comment || comment.trim().length === 0) {
      return res.status(400).json({ msg: 'Comment cannot be empty' });
    }

    // Find the tourist by username
    const tourist = await TouristModel.findOne({ Username: touristUsername });
    if (!tourist) {
      return res.status(404).json({ msg: 'Tourist not found' });
    }

    const completedActivity = tourist.completedActivities.find(it => it.ActivityName === activityName);
    if (!completedActivity) {
      return res.status(400).json({ msg: 'You must complete the activity before rating' });
    }

    // Find the itinerary
    const activity = await ActivityModel.findOne({ Name: activityName });
    if (!activity) {
      return res.status(404).json({ msg: 'activity not found' });
    }

    // Add the comment to the itinerary's Comments array
    activity.Comments.push({ touristUsername, Comment: comment });
    await activity.save();

    res.status(200).json({ msg: 'Comment added successfully!', comments: activity.Comments });
  } catch (error) {
    console.error('Error commenting on activity:', error);
    res.status(500).json({ error: error.message });
  }
};

const commentOnMuseum = async (req, res) => {
  const { touristUsername, museumName, comment } = req.body;

  try {
    // Validate comment
    if (!comment || comment.trim().length === 0) {
      return res.status(400).json({ msg: 'Comment cannot be empty' });
    }

    // Find the tourist by username
    const tourist = await TouristModel.findOne({ Username: touristUsername });
    if (!tourist) {
      return res.status(404).json({ msg: 'Tourist not found' });
    }

    const completedMuseum = tourist.completedMuseumEvents.find(it => it.MuseumName === museumName);
    if (!completedMuseum) {
      return res.status(400).json({ msg: 'You must complete the museum event before rating' });
    }

    // Find the itinerary
    const museum = await MuseumModel.findOne({ name: museumName });
    if (!museum) {
      return res.status(404).json({ msg: 'museum not found' });
    }

    // Add the comment to the itinerary's Comments array
    museum.Comments.push({ touristUsername, Comment: comment });
    await museum.save();

    res.status(200).json({ msg: 'Comment added successfully!', comments: museum.Comments });
  } catch (error) {
    console.error('Error commenting on museum:', error);
    res.status(500).json({ error: error.message });
  }
};

const commentOnHP = async (req, res) => {
  const { touristUsername, HPname, comment } = req.body;

  try {
    // Validate comment
    if (!comment || comment.trim().length === 0) {
      return res.status(400).json({ msg: 'Comment cannot be empty' });
    }

    // Find the tourist by username
    const tourist = await TouristModel.findOne({ Username: touristUsername });
    if (!tourist) {
      return res.status(404).json({ msg: 'Tourist not found' });
    }

    const completedHP = tourist.completedHistoricalPlaceEvent.find(it => it.HistoricalPlaceName === HPname);
    if (!completedHP) {
      return res.status(400).json({ msg: 'You must complete the hp event before rating' });
    }

    // Find the itinerary
    const hp = await HistoricalPlacesModel.findOne({ name: HPname });
    if (!hp) {
      return res.status(404).json({ msg: 'hp not found' });
    }

    // Add the comment to the itinerary's Comments array
    hp.Comments.push({ touristUsername, Comment: comment });
    await hp.save();

    res.status(200).json({ msg: 'Comment added successfully!', comments: hp.Comments });
  } catch (error) {
    console.error('Error commenting on hp:', error);
    res.status(500).json({ error: error.message });
  }
};



/*const deleteBookedActivity = async (req, res) => {
  const { touristUsername, activityName } = req.body;

  try {
    // Find the activity by name
    const activity = await ActivityModel.findOne({ Name: activityName });
    if (!activity) {
      return res.status(404).json({ msg: 'Activity not found' });
    }

    // Find the tourist by username
    const tourist = await TouristModel.findOne({ Username: touristUsername });
    if (!tourist) {
      return res.status(404).json({ msg: 'Tourist not found' });
    }

    // Calculate the time difference
    const today = new Date();
    const eventDate = new Date(activity.Date);
    const timeDifference = eventDate - today;
    const daysBeforeEvent = timeDifference / (1000 * 60 * 60 * 24);

    // Check if cancellation is allowed (more than 2 days before the event)
    if (daysBeforeEvent < 2) {
      return res.status(403).json({ msg: 'Cannot cancel activity less than 2 days before the event.' });
    }

    // Find the activity in the BookedActivities array and remove it
    const index = tourist.BookedActivities.findIndex(
      (activity) => activity.activityName === activityName
    );
    if (index === -1) {
      return res.status(404).json({ msg: 'Activity not found in booked activities.' });
    }

    // Remove the activity from the array
    tourist.BookedActivities.splice(index, 1);

    // Save the updated tourist document
    await tourist.save();

    // Respond with success
    res.status(200).json({ msg: 'Activity canceled successfully.' });
  } catch (error) {
    console.error('Error deleting activity:', error);
    res.status(500).json({ error: error.message });
  }
};*/
const deleteBookedActivity = async (req, res) => {
  const { touristUsername, activityName } = req.body;

  try {
    // Find the activity by name
    const activity = await ActivityModel.findOne({ Name: activityName });
    if (!activity) {
      return res.status(404).json({ msg: 'Activity not found' });
    }

    // Find the tourist by username
    const tourist = await TouristModel.findOne({ Username: touristUsername });
    if (!tourist) {
      return res.status(404).json({ msg: 'Tourist not found' });
    }

    // Calculate the time difference
    const today = new Date();
    const eventDate = new Date(activity.Date);
    const timeDifference = eventDate - today;
    const daysBeforeEvent = timeDifference / (1000 * 60 * 60 * 24);

    // Check if cancellation is allowed (more than 2 days before the event)
    if (daysBeforeEvent < 2) {
      return res.status(403).json({ msg: 'Cannot cancel activity less than 2 days before the event.' });
    }

    // Find the activity in the BookedActivities array and remove it
    const index = tourist.BookedActivities.findIndex(
      (activity) => activity.activityName === activityName
    );
    if (index === -1) {
      return res.status(404).json({ msg: 'Activity not found in booked activities.' });
    }

    // Remove the activity from the array
    tourist.BookedActivities.splice(index, 1);

    // Refund the activity price to the wallet
    const ticketPrice = activity.Price;
    tourist.Wallet += ticketPrice;

    // Deduct points based on BadgeLevelOfPoints
    if (tourist.BadgeLevelOfPoints === 1) {
      tourist.Points -= 0.5 * ticketPrice;
    } else if (tourist.BadgeLevelOfPoints === 2) {
      tourist.Points -= ticketPrice;
    } else if (tourist.BadgeLevelOfPoints === 3) {
      tourist.Points -= 1.5 * ticketPrice;
    }

    // Ensure points don't go below zero
    tourist.Points = Math.max(0, tourist.Points);

    // Adjust BadgeLevelOfPoints if necessary
    if (tourist.BadgeLevelOfPoints === 3 && tourist.Points < 500000) {
      tourist.BadgeLevelOfPoints = 2;
    } else if (tourist.BadgeLevelOfPoints === 2 && tourist.Points < 100000) {
      tourist.BadgeLevelOfPoints = 1;
    }

    // Save the updated tourist document
    await tourist.save();

    // Respond with success
    res.status(200).json({ 
      msg: 'Activity canceled successfully.',
      refundedAmount: ticketPrice,
      updatedWallet: tourist.Wallet,
      updatedPoints: tourist.Points,
      updatedBadgeLevel: tourist.BadgeLevelOfPoints 
    });
  } catch (error) {
    console.error('Error deleting activity:', error);
    res.status(500).json({ error: error.message });
  }
};

const deleteBookedItinerary = async (req, res) => {
  const { touristUsername, itineraryName } = req.body;

  try {
    // Find the activity by name
    const itinerary = await ItineraryModel.findOne({ Title: itineraryName });
    if (!itinerary) {
      return res.status(404).json({ msg: 'itinerary not found' });
    }

    // Find the tourist by username
    const tourist = await TouristModel.findOne({ Username: touristUsername });
    if (!tourist) {
      return res.status(404).json({ msg: 'Tourist not found' });
    }

    // Calculate the time difference
    const today = new Date();
    const eventDate = new Date(itinerary.Date);
    const timeDifference = eventDate - today;
    const daysBeforeEvent = timeDifference / (1000 * 60 * 60 * 24);

    // Check if cancellation is allowed (more than 2 days before the event)
    if (daysBeforeEvent < 2) {
      return res.status(403).json({ msg: 'Cannot cancel itinerary less than 2 days before the event.' });
    }

    // Find the activity in the BookedActivities array and remove it
    const index = tourist.BookedItineraries.findIndex(
      (itinerary) => itinerary.ItineraryName === itineraryName
    );
    if (index === -1) {
      return res.status(404).json({ msg: 'Activity not found in booked activities.' });
    }

    // Remove the activity from the array
    tourist.BookedItineraries.splice(index, 1);

     // Refund the activity price to the wallet
     const ticketPrice = itinerary.Price;
     tourist.Wallet += ticketPrice;
 
     // Deduct points based on BadgeLevelOfPoints
     if (tourist.BadgeLevelOfPoints === 1) {
       tourist.Points -= 0.5 * ticketPrice;
     } else if (tourist.BadgeLevelOfPoints === 2) {
       tourist.Points -= ticketPrice;
     } else if (tourist.BadgeLevelOfPoints === 3) {
       tourist.Points -= 1.5 * ticketPrice;
     }
 
     // Ensure points don't go below zero
     tourist.Points = Math.max(0, tourist.Points);
 
     // Adjust BadgeLevelOfPoints if necessary
     if (tourist.BadgeLevelOfPoints === 3 && tourist.Points < 500000) {
       tourist.BadgeLevelOfPoints = 2;
     } else if (tourist.BadgeLevelOfPoints === 2 && tourist.Points < 100000) {
       tourist.BadgeLevelOfPoints = 1;
     }

    // Save the updated tourist document
    await tourist.save();

    // Respond with success
    res.status(200).json({ 
      msg: 'Activity canceled successfully.',
      refundedAmount: ticketPrice,
      updatedWallet: tourist.Wallet,
      updatedPoints: tourist.Points,
      updatedBadgeLevel: tourist.BadgeLevelOfPoints 
    });
  } catch (error) {
    console.error('Error deleting itinerary:', error);
    res.status(500).json({ error: error.message });
  }
};



const deleteBookedMuseum= async (req, res) => {
  const { touristUsername, museumName } = req.body;

  try {
    // Find the activity by name
    const museum = await MuseumModel.findOne({ name: museumName });
    if (!museum) {
      return res.status(404).json({ msg: 'museum not found' });
    }

    // Find the tourist by username
    const tourist = await TouristModel.findOne({ Username: touristUsername });
    if (!tourist) {
      return res.status(404).json({ msg: 'Tourist not found' });
    }

    // Calculate the time difference
    const today = new Date();
    const eventDate = new Date(museum.dateOfEvent);
    const timeDifference = eventDate - today;
    const daysBeforeEvent = timeDifference / (1000 * 60 * 60 * 24);

    // Check if cancellation is allowed (more than 2 days before the event)
    if (daysBeforeEvent < 2) {
      return res.status(403).json({ msg: 'Cannot cancel museum event less than 2 days before the event.' });
    }

    // Find the activity in the BookedActivities array and remove it
    const index = tourist.BookedMuseums.findIndex(
      (museum) => museum.MuseumName === museumName
    );
    if (index === -1) {
      return res.status(404).json({ msg: 'museum not found in booked museum events.' });
    }

    // Remove the activity from the array
    tourist.BookedMuseums.splice(index, 1);

    let ticketPrice;
    if (tourist.Occupation.toLowerCase() === 'student') {
      ticketPrice = museum.ticketPrices.student;
    } else if (tourist.Nationality.toLowerCase() === 'egyptian') {
      ticketPrice = museum.ticketPrices.native;
    } else {
      ticketPrice = museum.ticketPrices.foreigner;
    }
    tourist.Wallet += ticketPrice;
 
     // Deduct points based on BadgeLevelOfPoints
     if (tourist.BadgeLevelOfPoints === 1) {
       tourist.Points -= 0.5 * ticketPrice;
     } else if (tourist.BadgeLevelOfPoints === 2) {
       tourist.Points -= ticketPrice;
     } else if (tourist.BadgeLevelOfPoints === 3) {
       tourist.Points -= 1.5 * ticketPrice;
     }
 
     // Ensure points don't go below zero
     tourist.Points = Math.max(0, tourist.Points);
 
     // Adjust BadgeLevelOfPoints if necessary
     if (tourist.BadgeLevelOfPoints === 3 && tourist.Points < 500000) {
       tourist.BadgeLevelOfPoints = 2;
     } else if (tourist.BadgeLevelOfPoints === 2 && tourist.Points < 100000) {
       tourist.BadgeLevelOfPoints = 1;
     }

    // Save the updated tourist document
    await tourist.save();

    // Respond with success
    res.status(200).json({ msg: 'museum event canceled successfully.' });
  } catch (error) {
    console.error('Error museum activity:', error);
    res.status(500).json({ error: error.message });
  }
};

const deleteBookedHP= async (req, res) => {
  const { touristUsername, HPName } = req.body;

  try {
    // Find the activity by name
    const hp = await HistoricalPlacesModel.findOne({ name: HPName });
    if (!hp) {
      return res.status(404).json({ msg: 'hp not found' });
    }

    // Find the tourist by username
    const tourist = await TouristModel.findOne({ Username: touristUsername });
    if (!tourist) {
      return res.status(404).json({ msg: 'Tourist not found' });
    }

    // Calculate the time difference
    const today = new Date();
    const eventDate = new Date(hp.dateOfEvent);
    const timeDifference = eventDate - today;
    const daysBeforeEvent = timeDifference / (1000 * 60 * 60 * 24);

    // Check if cancellation is allowed (more than 2 days before the event)
    if (daysBeforeEvent < 2) {
      return res.status(403).json({ msg: 'Cannot cancel HP event less than 2 days before the event.' });
    }

    // Find the activity in the BookedActivities array and remove it
    const index = tourist.BookedHistPlaces.findIndex(
      (hp) => hp.HistPlaceName === HPName
    );
    if (index === -1) {
      return res.status(404).json({ msg: 'hp not found in booked hp events.' });
    }

    // Remove the activity from the array
    tourist.BookedHistPlaces.splice(index, 1);

    let ticketPrice;
    if (tourist.Occupation.toLowerCase() === 'student') {
      ticketPrice = hp.ticketPrices.student;
    } else if (tourist.Nationality.toLowerCase() === 'egyptian') {
      ticketPrice = hp.ticketPrices.native;
    } else {
      ticketPrice = hp.ticketPrices.foreigner;
    }
    tourist.Wallet += ticketPrice;
 
     // Deduct points based on BadgeLevelOfPoints
     if (tourist.BadgeLevelOfPoints === 1) {
       tourist.Points -= 0.5 * ticketPrice;
     } else if (tourist.BadgeLevelOfPoints === 2) {
       tourist.Points -= ticketPrice;
     } else if (tourist.BadgeLevelOfPoints === 3) {
       tourist.Points -= 1.5 * ticketPrice;
     }
 
     // Ensure points don't go below zero
     tourist.Points = Math.max(0, tourist.Points);
 
     // Adjust BadgeLevelOfPoints if necessary
     if (tourist.BadgeLevelOfPoints === 3 && tourist.Points < 500000) {
       tourist.BadgeLevelOfPoints = 2;
     } else if (tourist.BadgeLevelOfPoints === 2 && tourist.Points < 100000) {
       tourist.BadgeLevelOfPoints = 1;
     }

    // Save the updated tourist document
    await tourist.save();

    // Respond with success
    res.status(200).json({ msg: 'hp event canceled successfully.' });
  } catch (error) {
    console.error('Error hp activity:', error);
    res.status(500).json({ error: error.message });
  }
};


const payActivity = async (req, res) => {
  const { touristUsername, activityName } = req.body;

  try {
    // Find the activity by name
    const activity = await ActivityModel.findOne({ Name: activityName });
    if (!activity) {
      return res.status(404).json({ msg: 'Activity not found' });
    }

    // Find the tourist by username
    const tourist = await TouristModel.findOne({ Username: touristUsername });
    if (!tourist) {
      return res.status(404).json({ msg: 'Tourist not found' });
    }

    tourist.BookedActivities.push({
      activityName: activity.Name,
      confirmed: true 
    });

    activity.isBooked = true;
    await activity.save(); 
    //await tourist.save();

    // Check if the activity is in the booked activities list
    const bookedActivityIndex = tourist.BookedActivities.findIndex(
      (activity) => activity.activityName === activityName
    );

    

    if (bookedActivityIndex === -1) {
      return res.status(400).json({ msg: 'Activity not found in booked activities. Please book the activity first.' });
    }

    // Calculate ticket price
    const ticketPrice = activity.Price;

    // Check if the tourist has enough funds in the wallet
    if (tourist.Wallet < ticketPrice) {
      // Remove the activity from the booked activities list if funds are insufficient
      //tourist.BookedActivities.splice(bookedActivityIndex, 1);
      //await tourist.save();
      return res.status(400).json({ msg: 'Insufficient funds in wallet. The activity has been removed from booked activities.' });
    }
   


    // Deduct the ticket price from the tourist's wallet
    tourist.Wallet -= ticketPrice;

    // Update points and badge level
    if (tourist.BadgeLevelOfPoints === 1) {
      tourist.Points += 0.5 * ticketPrice;
      if (tourist.Points > 100000) {
        tourist.BadgeLevelOfPoints = 2;
      } else if (tourist.Points > 500000) {
        tourist.BadgeLevelOfPoints = 3;
      }
    } else if (tourist.BadgeLevelOfPoints === 2) {
      tourist.Points += ticketPrice;
      if (tourist.Points > 500000) {
        tourist.BadgeLevelOfPoints = 3;
      }
    } else if (tourist.BadgeLevelOfPoints === 3) {
      tourist.Points += 1.5 * ticketPrice;
    }

    // Save the updated tourist information
    await tourist.save();

     // Set up the email transporter
     const transporter1 = nodemailer.createTransport({
      service: 'gmail', // You can use other email services if necessary
      auth: {
        user: 'malook25062003@gmail.com', // Your email
        pass: 'sxvo feuu woie gpfn', // Your email password or app-specific password
      },
    });

    // Create the email options
    const paymentDate = new Date();
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: tourist.Email,
      subject: 'Payment Receipt',
      text: `Dear ${touristUsername},

    Thank you for your payment for the activity "${activityName}".

    Here are the details of your transaction:
    - Activity Name: ${activityName}
    - Amount Paid: ${ticketPrice}
    - Payment Date: ${paymentDate.toLocaleDateString()}
    - Payment Time: ${paymentDate.toLocaleTimeString()}

    Thank you for choosing our service!

    Best regards,
    Beyond Borders`,
    };

    // Send the email
    await transporter1.sendMail(mailOptions);

    // Respond with success and remaining wallet balance
    res.status(200).json({
      msg: 'Payment successful! An email has been sent with your payment details.',
      activityName: activity.Name,
      remainingWallet: tourist.Wallet,
      BadgeLevelOfPoints: tourist.BadgeLevelOfPoints,
      Points: tourist.Points,
    });
  } catch (error) {
    console.error('Error processing payment for activity:', error);
    res.status(500).json({ error: error.message });
  }
};



const payActivityByCard = async (req, res) => {
  const { touristUsername, activityName } = req.body;

  try {
    // Find the activity by name
    const activity = await ActivityModel.findOne({ Name: activityName });
    if (!activity) {
      return res.status(404).json({ msg: 'Activity not found' });
    }

    // Find the tourist by username
    const tourist = await TouristModel.findOne({ Username: touristUsername });
    if (!tourist) {
      return res.status(404).json({ msg: 'Tourist not found' });
    }
    tourist.BookedActivities.push({
      activityName: activity.Name,
      confirmed: true 
    });

    activity.isBooked = true;
    await activity.save(); 

    // Check if the activity is in the booked activities list
    const bookedActivityIndex = tourist.BookedActivities.findIndex(
      (activity) => activity.activityName === activityName
    );

    if (bookedActivityIndex === -1) {
      return res.status(400).json({ msg: 'Activity not found in booked activities. Please book the activity first.' });
    }

    // Calculate ticket price
    const ticketPrice = activity.Price;

    // Update points and badge level
    if (tourist.BadgeLevelOfPoints === 1) {
      tourist.Points += 0.5 * ticketPrice;
      if (tourist.Points > 100000) {
        tourist.BadgeLevelOfPoints = 2;
      } else if (tourist.Points > 500000) {
        tourist.BadgeLevelOfPoints = 3;
      }
    } else if (tourist.BadgeLevelOfPoints === 2) {
      tourist.Points += ticketPrice;
      if (tourist.Points > 500000) {
        tourist.BadgeLevelOfPoints = 3;
      }
    } else if (tourist.BadgeLevelOfPoints === 3) {
      tourist.Points += 1.5 * ticketPrice;
    }

    // Save the updated tourist information
    await tourist.save();

    // Set up the email transporter
    const transporter1 = nodemailer.createTransport({
      service: 'gmail', // You can use other email services if necessary
      auth: {
        user: 'malook25062003@gmail.com', // Your email
        pass: 'sxvo feuu woie gpfn', // Your email password or app-specific password
      },
    });

    // Create the email options
    const paymentDate = new Date();
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: tourist.Email,
      subject: 'Payment Receipt',
      text: `Dear ${touristUsername},

    Thank you for your payment for the activity "${activityName}".

    Here are the details of your transaction:
    - Activity Name: ${activityName}
    - Amount Paid: ${ticketPrice}
    - Payment Date: ${paymentDate.toLocaleDateString()}
    - Payment Time: ${paymentDate.toLocaleTimeString()}

    Thank you for choosing our service!

    Best regards,
    Beyond Borders`,
    };

    // Send the email
    await transporter1.sendMail(mailOptions);

    // Respond with success and remaining wallet balance
    res.status(200).json({
      msg: 'Payment successful! An email has been sent with your payment details.',
      activityName: activity.Name,
      BadgeLevelOfPoints: tourist.BadgeLevelOfPoints,
      Points: tourist.Points,
    });
  } catch (error) {
    console.error('Error processing payment for activity:', error);
    res.status(500).json({ error: error.message });
  }
};


const payActivityStripe = async (req, res) => {
  const { touristUsername, activityName } = req.body;

  try {

    const paymentMethodId = "pm_card_visa";
    // Find the activity by name
    const activity = await ActivityModel.findOne({ Name: activityName });
    if (!activity) {
      return res.status(404).json({ msg: 'Activity not found' });
    }

    // Find the tourist by username
    const tourist = await TouristModel.findOne({ Username: touristUsername });
    if (!tourist) {
      return res.status(404).json({ msg: 'Tourist not found' });
    }

    // Calculate ticket price
    const ticketPrice = activity.Price;

    // Process payment with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(ticketPrice * 100), // Stripe uses the smallest currency unit (e.g., cents for USD, piastres for EGP)
      currency: 'usd', // Use EGP as the currency
      payment_method: paymentMethodId, // Payment method ID from the frontend
      confirm: true, // Automatically confirm the payment
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
    });

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ msg: 'Payment failed. Please try again.' });
    }

    // Update activity as booked
    tourist.BookedActivities.push({
      activityName: activity.Name,
      confirmed: true,
    });

    activity.isBooked = true;
    await activity.save();

    // Update points and badge level
    if (tourist.BadgeLevelOfPoints === 1) {
      tourist.Points += 0.5 * ticketPrice;
      if (tourist.Points > 100000) {
        tourist.BadgeLevelOfPoints = 2;
      } else if (tourist.Points > 500000) {
        tourist.BadgeLevelOfPoints = 3;
      }
    } else if (tourist.BadgeLevelOfPoints === 2) {
      tourist.Points += ticketPrice;
      if (tourist.Points > 500000) {
        tourist.BadgeLevelOfPoints = 3;
      }
    } else if (tourist.BadgeLevelOfPoints === 3) {
      tourist.Points += 1.5 * ticketPrice;
    }

    // Save the updated tourist information
    await tourist.save();

    // Set up the email transporter
    const transporter1 = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'malook25062003@gmail.com', // Your email
        pass: 'sxvo feuu woie gpfn', // Your email password or app-specific password
      },
    });

    // Create the email options
    const paymentDate = new Date();
    const mailOptions = {
      from: 'malook25062003@gmail.com',
      to: tourist.Email,
      subject: 'Payment Receipt',
      text: `Dear ${tourist.Username},

Thank you for your payment for the activity "${activityName}".

Here are the details of your transaction:
- Activity Name: ${activityName}
- Amount Paid: ${ticketPrice} EGP
- Payment Date: ${paymentDate.toLocaleDateString()}
- Payment Time: ${paymentDate.toLocaleTimeString()}

Thank you for choosing our service!

Best regards,
The Beyond Borders Team`,
    };

    // Send the email
    await transporter1.sendMail(mailOptions);

    // Respond with success
    res.status(200).json({
      msg: 'Payment successful! An email has been sent with your payment details.',
      activityName: activity.Name,
      BadgeLevelOfPoints: tourist.BadgeLevelOfPoints,
      Points: tourist.Points,
    });
  } catch (error) {
    console.error('Error processing payment for activity:', error);
    res.status(500).json({ error: error.message });
  }
};




const updateWallet = async (req, res) => {
  const { username, amount } = req.body;

  try {
    // Find the tourist by username
    const tourist = await TouristModel.findOne({ Username: username });
    if (!tourist) {
      return res.status(404).json({ msg: 'Tourist not found' });
    }

    // Update the wallet balance
    tourist.Wallet =  amount;

    // Save the updated tourist document
    await tourist.save();

    // Respond with success and updated wallet balance
    res.status(200).json({ msg: 'Wallet updated successfully!', updatedWallet: tourist.Wallet});
  } catch (error) {
    console.error('Error updating wallet:', error);
    res.status(500).json({ error: error.message });
  }
};
const updatepoints = async (req, res) => {
  const { username, points,level } = req.body;

  try {
    // Find the tourist by username
    const tourist = await TouristModel.findOne({ Username: username });
    if (!tourist) {
      return res.status(404).json({ msg: 'Tourist not found' });
    }

    // Update the wallet balance
    tourist.Points = points;
    tourist.BadgeLevelOfPoints = level;

    // Save the updated tourist document
    await tourist.save();

    // Respond with success and updated wallet balance
    res.status(200).json({ msg: 'Wallet updated successfully!', updatedPoints: tourist.Points, updatedLevel:tourist.BadgeLevelOfPoints});
  } catch (error) {
    console.error('Error updating wallet:', error);
    res.status(500).json({ error: error.message });
  }
};

const payItinerary = async (req, res) => {
  const { touristUsername, ItineraryName } = req.body;

  try {
    // Find the itinerary by name
    const itinerary = await ItineraryModel.findOne({ Title: ItineraryName });
    if (!itinerary) {
      return res.status(404).json({ msg: 'Itinerary not found' });
    }

    // Find the tourist by username
    const tourist = await TouristModel.findOne({ Username: touristUsername });
    if (!tourist) {
      return res.status(404).json({ msg: 'Tourist not found' });
    }

    tourist.BookedItineraries.push({
      ItineraryName: itinerary.Title,  
      booked: true,
      DateOfBooking: new Date() // Add today's date
    });

    // Check if the itinerary is in the booked itineraries list
    const bookedItineraryIndex = tourist.BookedItineraries.findIndex(
      (itinerary) => itinerary.ItineraryName === ItineraryName
    );

    if (bookedItineraryIndex === -1) {
      return res.status(400).json({ msg: 'Itinerary not found in booked itineraries. Please book the itinerary first.' });
    }

    // Calculate itinerary price
    const ticketPrice = itinerary.Price;

    // Check if the tourist has enough funds in the wallet
    if (tourist.Wallet < ticketPrice) {
      // Remove the itinerary from booked itineraries if funds are insufficient
      tourist.BookedItineraries.splice(bookedItineraryIndex, 1);
      await tourist.save();
      return res.status(400).json({ msg: 'Insufficient funds in wallet. The itinerary has been removed from booked itineraries.' });
    }

    // Deduct the ticket price from the tourist's wallet
    tourist.Wallet -= ticketPrice;

    // Update points and badge level
    if (tourist.BadgeLevelOfPoints === 1) {
      tourist.Points += 0.5 * ticketPrice;
      if (tourist.Points > 100000) {
        tourist.BadgeLevelOfPoints = 2;
      } else if (tourist.Points > 500000) {
        tourist.BadgeLevelOfPoints = 3;
      }
    } else if (tourist.BadgeLevelOfPoints === 2) {
      tourist.Points += ticketPrice;
      if (tourist.Points > 500000) {
        tourist.BadgeLevelOfPoints = 3;
      }
    } else if (tourist.BadgeLevelOfPoints === 3) {
      tourist.Points += 1.5 * ticketPrice;
    }

    // Save the updated tourist information
    await tourist.save();
// Set up the email transporter
const transporter1 = nodemailer.createTransport({
  service: 'gmail', // You can use other email services if necessary
  auth: {
    user: 'malook25062003@gmail.com', // Your email
    pass: 'sxvo feuu woie gpfn', // Your email password or app-specific password
  },
});

// Create the email options
const paymentDate = new Date();
const mailOptions = {
  from: process.env.EMAIL_USER,
  to: tourist.Email,
  subject: 'Payment Receipt',
  text: `Dear ${touristUsername},

Thank you for your payment for the itinerary "${ItineraryName}".

Here are the details of your transaction:
- Activity Name: ${ItineraryName}
- Amount Paid: ${ticketPrice}
- Payment Date: ${paymentDate.toLocaleDateString()}
- Payment Time: ${paymentDate.toLocaleTimeString()}

Thank you for choosing our service!

Best regards,
Beyond Borders`,
};

// Send the email
await transporter1.sendMail(mailOptions);

// Respond with success and remaining wallet balance
res.status(200).json({
  msg: 'Payment successful! An email has been sent with your payment details.',
  ItineraryName: itinerary.Title,
  BadgeLevelOfPoints: tourist.BadgeLevelOfPoints,
  remainingWallet: tourist.Wallet,
  Points: tourist.Points,
});
} catch (error) {
console.error('Error processing payment for itinerary:', error);
res.status(500).json({ error: error.message });
}
};

const payItineraryByCard = async (req, res) => {
  const { touristUsername, ItineraryName } = req.body;

  try {
    // Find the itinerary by name
    const itinerary = await ItineraryModel.findOne({ Title: ItineraryName });
    if (!itinerary) {
      return res.status(404).json({ msg: 'Itinerary not found' });
    }

    // Find the tourist by username
    const tourist = await TouristModel.findOne({ Username: touristUsername });
    if (!tourist) {
      return res.status(404).json({ msg: 'Tourist not found' });
    }

    tourist.BookedItineraries.push({
      ItineraryName: itinerary.Title,  
      booked: true,
      DateOfBooking: new Date()
    });

    // Check if the itinerary is in the booked itineraries list
    const bookedItineraryIndex = tourist.BookedItineraries.findIndex(
      (itinerary) => itinerary.ItineraryName === ItineraryName
    );

    if (bookedItineraryIndex === -1) {
      return res.status(400).json({ msg: 'Itinerary not found in booked itineraries. Please book the itinerary first.' });
    }

    // Calculate itinerary price
    const ticketPrice = itinerary.Price;

    // Update points and badge level
    if (tourist.BadgeLevelOfPoints === 1) {
      tourist.Points += 0.5 * ticketPrice;
      if (tourist.Points > 100000) {
        tourist.BadgeLevelOfPoints = 2;
      } else if (tourist.Points > 500000) {
        tourist.BadgeLevelOfPoints = 3;
      }
    } else if (tourist.BadgeLevelOfPoints === 2) {
      tourist.Points += ticketPrice;
      if (tourist.Points > 500000) {
        tourist.BadgeLevelOfPoints = 3;
      }
    } else if (tourist.BadgeLevelOfPoints === 3) {
      tourist.Points += 1.5 * ticketPrice;
    }

    // Save the updated tourist information
    await tourist.save();

    // Set up the email transporter
    const transporter1 = nodemailer.createTransport({
      service: 'gmail', // You can use other email services if necessary
      auth: {
        user: 'malook25062003@gmail.com', // Your email
        pass: 'sxvo feuu woie gpfn', // Your email password or app-specific password
      },
    });

    // Create the email options
    const paymentDate = new Date();
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: tourist.Email,
      subject: 'Payment Receipt',
      text: `Dear ${touristUsername},

    Thank you for your payment for the itinerary "${ItineraryName}".

    Here are the details of your transaction:
    - Activity Name: ${ItineraryName}
    - Amount Paid: ${ticketPrice}
    - Payment Date: ${paymentDate.toLocaleDateString()}
    - Payment Time: ${paymentDate.toLocaleTimeString()}

    Thank you for choosing our service!

    Best regards,
    Beyond Borders`,
    };

    // Send the email
    await transporter1.sendMail(mailOptions);

    // Respond with success and remaining wallet balance
    res.status(200).json({
      msg: 'Payment successful! An email has been sent with your payment details.',
      ItineraryName: itinerary.Title,
      BadgeLevelOfPoints: tourist.BadgeLevelOfPoints,
      Points: tourist.Points,
    });
  } catch (error) {
    console.error('Error processing payment for itinerary:', error);
    res.status(500).json({ error: error.message });
  }
};

const payItineraryStripe = async (req, res) => {
  const { touristUsername, ItineraryName } = req.body;

  try {
    const paymentMethodId ="pm_card_visa";
    // Find the itinerary by name
    const itinerary = await ItineraryModel.findOne({ Title: ItineraryName });
    if (!itinerary) {
      return res.status(404).json({ msg: 'Itinerary not found' });
    }

    // Find the tourist by username
    const tourist = await TouristModel.findOne({ Username: touristUsername });
    if (!tourist) {
      return res.status(404).json({ msg: 'Tourist not found' });
    }

    // Calculate itinerary price
    const ticketPrice = itinerary.Price;

    // Process payment with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(ticketPrice * 100), // Stripe works with the smallest currency unit (e.g., piasters for EGP)
      currency: 'usd',
      payment_method: paymentMethodId, // Payment method ID from the frontend
      confirm: true, // Automatically confirm the payment
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
    });

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ error: 'Payment failed. Please try again.' });
    }

    // Add itinerary to the tourist's booked itineraries
    tourist.BookedItineraries.push({
      ItineraryName: itinerary.Title,
      booked: true,
      DateOfBooking: new Date()
    });

    // Update points and badge level
    if (tourist.BadgeLevelOfPoints === 1) {
      tourist.Points += 0.5 * ticketPrice;
      if (tourist.Points > 100000) {
        tourist.BadgeLevelOfPoints = 2;
      } else if (tourist.Points > 500000) {
        tourist.BadgeLevelOfPoints = 3;
      }
    } else if (tourist.BadgeLevelOfPoints === 2) {
      tourist.Points += ticketPrice;
      if (tourist.Points > 500000) {
        tourist.BadgeLevelOfPoints = 3;
      }
    } else if (tourist.BadgeLevelOfPoints === 3) {
      tourist.Points += 1.5 * ticketPrice;
    }

    await tourist.save();

    // Set up the email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
      user: 'malook25062003@gmail.com', 
      pass: 'sxvo feuu woie gpfn',
      },
    });

    // Create the email options
    const paymentDate = new Date();
    const mailOptions = {
      from: 'malook25062003@gmail.com', // Replace with your email
      to: tourist.Email,
      subject: 'Payment Receipt',
      text: `Dear ${tourist.Username},

Thank you for your payment for the itinerary "${ItineraryName}".

Here are the details of your transaction:
- Itinerary Name: ${ItineraryName}
- Amount Paid: ${ticketPrice} EGP
- Payment Date: ${paymentDate.toLocaleDateString()}
- Payment Time: ${paymentDate.toLocaleTimeString()}

Thank you for choosing our service!

Best regards,
Beyond Borders`,
    };



    await transporter.sendMail(mailOptions);

    // Respond with success message
    res.status(200).json({
      msg: 'Payment successful! An email has been sent with your payment details.',
      ItineraryName: itinerary.Title,
      BadgeLevelOfPoints: tourist.BadgeLevelOfPoints,
      Points: tourist.Points,
    });
  } catch (error) {
    console.error('Error processing payment for itinerary:', error);
    res.status(500).json({ error: 'Failed to process payment for itinerary.' });
  }
};


const payMuseum = async (req, res) => {
  const { touristUsername, museumName } = req.body;

  try {
    // Find the museum by name
    const museum = await MuseumModel.findOne({ name: museumName });
    if (!museum) {
      return res.status(404).json({ msg: 'Museum not found' });
    }

    // Find the tourist by username
    const tourist = await TouristModel.findOne({ Username: touristUsername });
    if (!tourist) {
      return res.status(404).json({ msg: 'Tourist not found' });
    }

    tourist.BookedMuseums.push({
      MuseumName: museum.name,  
      booked: true 
    });


    // Check if the museum is in the booked museums list
    const bookedMuseumIndex = tourist.BookedMuseums.findIndex(
      (museum) => museum.MuseumName === museumName
    );

    if (bookedMuseumIndex === -1) {
      return res.status(400).json({ msg: 'Museum not found in booked activities. Please book the museum event first.' });
    }

    // Calculate ticket price
    let ticketPrice;
    if (tourist.Occupation.toLowerCase() === 'student') {
      ticketPrice = museum.ticketPrices.student;
    } else if (tourist.Nationality.toLowerCase() === 'egyptian') {
      ticketPrice = museum.ticketPrices.native;
    } else {
      ticketPrice = museum.ticketPrices.foreigner;
    }

    // Check if the tourist has enough funds in the wallet
    if (tourist.Wallet < ticketPrice) {
      // Remove the museum from the booked museums if funds are insufficient
      tourist.BookedMuseums.splice(bookedMuseumIndex, 1);
      await tourist.save();
      return res.status(400).json({ msg: 'Insufficient funds in wallet. The museum has been removed from booked activities.' });
    }

    // Deduct the ticket price from the tourist's wallet
    tourist.Wallet -= ticketPrice;

    // Update points and badge level
    if (tourist.BadgeLevelOfPoints === 1) {
      tourist.Points += 0.5 * ticketPrice;
      if (tourist.Points > 100000) {
        tourist.BadgeLevelOfPoints = 2;
      } else if (tourist.Points > 500000) {
        tourist.BadgeLevelOfPoints = 3;
      }
    } else if (tourist.BadgeLevelOfPoints === 2) {
      tourist.Points += ticketPrice;
      if (tourist.Points > 500000) {
        tourist.BadgeLevelOfPoints = 3;
      }
    } else if (tourist.BadgeLevelOfPoints === 3) {
      tourist.Points += 1.5 * ticketPrice;
    }

    // Save the updated tourist information
    await tourist.save();

   // Set up the email transporter
const transporter1 = nodemailer.createTransport({
  service: 'gmail', // You can use other email services if necessary
  auth: {
    user: 'malook25062003@gmail.com', // Your email
    pass: 'sxvo feuu woie gpfn', // Your email password or app-specific password
  },
});

// Create the email options
const paymentDate = new Date();
const mailOptions = {
  from: process.env.EMAIL_USER,
  to: tourist.Email,
  subject: 'Payment Receipt',
  text: `Dear ${touristUsername},

Thank you for your payment for the itinerary "${museumName}".

Here are the details of your transaction:
- Activity Name: ${museumName}
- Amount Paid: ${ticketPrice}
- Payment Date: ${paymentDate.toLocaleDateString()}
- Payment Time: ${paymentDate.toLocaleTimeString()}

Thank you for choosing our service!

Best regards,
Beyond Borders`,
};

// Send the email
await transporter1.sendMail(mailOptions);

// Respond with success and remaining wallet balance
res.status(200).json({
  msg: 'Payment successful! An email has been sent with your payment details.',
  msueumName: museum.name,
  remainingWallet: tourist.Wallet,
  BadgeLevelOfPoints: tourist.BadgeLevelOfPoints,
  Points: tourist.Points,
});
} catch (error) {
console.error('Error processing payment for museum:', error);
res.status(500).json({ error: error.message });
}
};

const payMuseumByCard = async (req, res) => {
  const { touristUsername, museumName } = req.body;

  try {
    // Find the museum by name
    const museum = await MuseumModel.findOne({ name: museumName });
    if (!museum) {
      return res.status(404).json({ msg: 'Museum not found' });
    }

    // Find the tourist by username
    const tourist = await TouristModel.findOne({ Username: touristUsername });
    if (!tourist) {
      return res.status(404).json({ msg: 'Tourist not found' });
    }

    tourist.BookedMuseums.push({
      MuseumName: museum.name,  
      booked: true 
    });


    // Check if the museum is in the booked museums list
    const bookedMuseumIndex = tourist.BookedMuseums.findIndex(
      (museum) => museum.MuseumName === museumName
    );

    if (bookedMuseumIndex === -1) {
      return res.status(400).json({ msg: 'Museum not found in booked activities. Please book the museum event first.' });
    }

    // Calculate ticket price
    let ticketPrice;
    if (tourist.Occupation.toLowerCase() === 'student') {
      ticketPrice = museum.ticketPrices.student;
    } else if (tourist.Nationality.toLowerCase() === 'egyptian') {
      ticketPrice = museum.ticketPrices.native;
    } else {
      ticketPrice = museum.ticketPrices.foreigner;
    }

    // Update points and badge level
    if (tourist.BadgeLevelOfPoints === 1) {
      tourist.Points += 0.5 * ticketPrice;
      if (tourist.Points > 100000) {
        tourist.BadgeLevelOfPoints = 2;
      } else if (tourist.Points > 500000) {
        tourist.BadgeLevelOfPoints = 3;
      }
    } else if (tourist.BadgeLevelOfPoints === 2) {
      tourist.Points += ticketPrice;
      if (tourist.Points > 500000) {
        tourist.BadgeLevelOfPoints = 3;
      }
    } else if (tourist.BadgeLevelOfPoints === 3) {
      tourist.Points += 1.5 * ticketPrice;
    }

    // Save the updated tourist information
    await tourist.save();
// Set up the email transporter
const transporter1 = nodemailer.createTransport({
  service: 'gmail', // You can use other email services if necessary
  auth: {
    user: 'malook25062003@gmail.com', // Your email
    pass: 'sxvo feuu woie gpfn', // Your email password or app-specific password
  },
});

// Create the email options
const paymentDate = new Date();
const mailOptions = {
  from: process.env.EMAIL_USER,
  to: tourist.Email,
  subject: 'Payment Receipt',
  text: `Dear ${touristUsername},

Thank you for your payment for the itinerary "${museumName}".

Here are the details of your transaction:
- Activity Name: ${museumName}
- Amount Paid: ${ticketPrice}
- Payment Date: ${paymentDate.toLocaleDateString()}
- Payment Time: ${paymentDate.toLocaleTimeString()}

Thank you for choosing our service!

Best regards,
Beyond Borders`,
};

// Send the email
await transporter1.sendMail(mailOptions);

// Respond with success and remaining wallet balance
res.status(200).json({
  msg: 'Payment successful! An email has been sent with your payment details.',
  msueumName: museum.name,
  BadgeLevelOfPoints: tourist.BadgeLevelOfPoints,
  Points: tourist.Points,
});
} catch (error) {
console.error('Error processing payment for museum:', error);
res.status(500).json({ error: error.message });
}
};

const payMuseumStripe = async (req, res) => {
  const { touristUsername, museumName } = req.body;

  try {
    const paymentMethodId = 'pm_card_visa'; // You can replace this with the actual PaymentMethod ID sent from the frontend

    // Find the museum by name
    const museum = await MuseumModel.findOne({ name: museumName });
    if (!museum) {
      return res.status(404).json({ msg: 'Museum not found' });
    }

    // Find the tourist by username
    const tourist = await TouristModel.findOne({ Username: touristUsername });
    if (!tourist) {
      return res.status(404).json({ msg: 'Tourist not found' });
    }

    // Calculate ticket price based on tourist's occupation or nationality
    let ticketPrice;
    if (tourist.Occupation.toLowerCase() === 'student') {
      ticketPrice = museum.ticketPrices.student;
    } else if (tourist.Nationality.toLowerCase() === 'egyptian') {
      ticketPrice = museum.ticketPrices.native;
    } else {
      ticketPrice = museum.ticketPrices.foreigner;
    }

    // Process payment with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(ticketPrice * 100), // Convert price to the smallest currency unit
      currency: 'usd', // Change to 'egp' if enabled in your Stripe account
      payment_method: paymentMethodId, // Payment method ID from the frontend
      confirm: true, // Automatically confirm the payment
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
    });

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ error: 'Payment failed. Please try again.' });
    }

    // Add museum to tourist's booked museums
    tourist.BookedMuseums.push({
      MuseumName: museum.name,
      booked: true,
    });

    // Update points and badge level
    if (tourist.BadgeLevelOfPoints === 1) {
      tourist.Points += 0.5 * ticketPrice;
      if (tourist.Points > 100000) {
        tourist.BadgeLevelOfPoints = 2;
      } else if (tourist.Points > 500000) {
        tourist.BadgeLevelOfPoints = 3;
      }
    } else if (tourist.BadgeLevelOfPoints === 2) {
      tourist.Points += ticketPrice;
      if (tourist.Points > 500000) {
        tourist.BadgeLevelOfPoints = 3;
      }
    } else if (tourist.BadgeLevelOfPoints === 3) {
      tourist.Points += 1.5 * ticketPrice;
    }

    await tourist.save();

    // Send payment receipt email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'malook25062003@gmail.com', // Your email
        pass: 'sxvo feuu woie gpfn',
      },
    });

    const paymentDate = new Date();
    const mailOptions = {
      from: 'malook25062003@gmail.com',
      to: tourist.Email,
      subject: 'Payment Receipt for Museum Booking',
      text: `Dear ${tourist.Username},

Thank you for your payment for the museum "${museumName}".

Here are the details of your transaction:
- Museum Name: ${museumName}
- Amount Paid: ${ticketPrice} USD
- Payment Date: ${paymentDate.toLocaleDateString()}
- Payment Time: ${paymentDate.toLocaleTimeString()}

Thank you for choosing Beyond Borders!

Best regards,
Beyond Borders Team`,
    };

    await transporter.sendMail(mailOptions);

    // Respond with success
    res.status(200).json({
      msg: 'Payment successful! An email has been sent with your payment details.',
      museumName: museum.name,
      BadgeLevelOfPoints: tourist.BadgeLevelOfPoints,
      Points: tourist.Points,
    });
  } catch (error) {
    console.error('Error processing payment for museum:', error);
    res.status(500).json({ error: 'Failed to process payment for museum.' });
  }
};

const payHP = async (req, res) => {
  const { touristUsername, HPName } = req.body;

  try {
    // Find the historical place by name
    const hp = await HistoricalPlacesModel.findOne({ name: HPName });
    if (!hp) {
      return res.status(404).json({ msg: 'Historical place not found' });
    }

    // Find the tourist by username
    const tourist = await TouristModel.findOne({ Username: touristUsername });
    if (!tourist) {
      return res.status(404).json({ msg: 'Tourist not found' });
    }

    tourist.BookedHistPlaces.push({
      HistPlaceName: hp.name,  
      booked: true 
    });

    // Check if the historical place is in the booked historical places list
    const bookedHistPlaceIndex = tourist.BookedHistPlaces.findIndex(
      (place) => place.HistPlaceName === HPName
    );

    if (bookedHistPlaceIndex === -1) {
      return res.status(400).json({ msg: 'Historical place not found in booked activities. Please book the historical place event first.' });
    }

    // Calculate ticket price
    let ticketPrice;
    if (tourist.Occupation.toLowerCase() === 'student') {
      ticketPrice = hp.ticketPrices.student;
    } else if (tourist.Nationality.toLowerCase() === 'egyptian') {
      ticketPrice = hp.ticketPrices.native;
    } else {
      ticketPrice = hp.ticketPrices.foreigner;
    }

    // Check if the tourist has enough funds in the wallet
    if (tourist.Wallet < ticketPrice) {
      // Remove the historical place from booked historical places if funds are insufficient
      tourist.BookedHistPlaces.splice(bookedHistPlaceIndex, 1);
      await tourist.save();
      return res.status(400).json({ msg: 'Insufficient funds in wallet. The historical place has been removed from booked activities.' });
    }

    // Deduct the ticket price from the tourist's wallet
    tourist.Wallet -= ticketPrice;

    // Update points and badge level
    if (tourist.BadgeLevelOfPoints === 1) {
      tourist.Points += 0.5 * ticketPrice;
      if (tourist.Points > 100000) {
        tourist.BadgeLevelOfPoints = 2;
      } else if (tourist.Points > 500000) {
        tourist.BadgeLevelOfPoints = 3;
      }
    } else if (tourist.BadgeLevelOfPoints === 2) {
      tourist.Points += ticketPrice;
      if (tourist.Points > 500000) {
        tourist.BadgeLevelOfPoints = 3;
      }
    } else if (tourist.BadgeLevelOfPoints === 3) {
      tourist.Points += 1.5 * ticketPrice;
    }

    // Save the updated tourist information
    await tourist.save();

    const transporter1 = nodemailer.createTransport({
      service: 'gmail', // You can use other email services if necessary
      auth: {
        user: 'malook25062003@gmail.com', // Your email
        pass: 'sxvo feuu woie gpfn', // Your email password or app-specific password
      },
    });
    
    // Create the email options
    const paymentDate = new Date();
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: tourist.Email,
      subject: 'Payment Receipt',
      text: `Dear ${touristUsername},
    
    Thank you for your payment for the itinerary "${HPName}".
    
    Here are the details of your transaction:
    - Activity Name: ${HPName}
    - Amount Paid: ${ticketPrice}
    - Payment Date: ${paymentDate.toLocaleDateString()}
    - Payment Time: ${paymentDate.toLocaleTimeString()}
    
    Thank you for choosing our service!
    
    Best regards,
    Beyond Borders`,
    };
    
    // Send the email
    await transporter1.sendMail(mailOptions);
    
    // Respond with success and remaining wallet balance
    res.status(200).json({
      msg: 'Payment successful! An email has been sent with your payment details.',
      hpName: hp.name,
      remainingWallet: tourist.Wallet,
      BadgeLevelOfPoints: tourist.BadgeLevelOfPoints,
      Points: tourist.Points,
    });
    } catch (error) {
    console.error('Error processing payment for hp:', error);
    res.status(500).json({ error: error.message });
    }
};

const payHPByCard = async (req, res) => {
  const { touristUsername, HPName } = req.body;

  try {
    // Find the historical place by name
    const hp = await HistoricalPlacesModel.findOne({ name: HPName });
    if (!hp) {
      return res.status(404).json({ msg: 'Historical place not found' });
    }

    // Find the tourist by username
    const tourist = await TouristModel.findOne({ Username: touristUsername });
    if (!tourist) {
      return res.status(404).json({ msg: 'Tourist not found' });
    }

    tourist.BookedHistPlaces.push({
      HistPlaceName: hp.name,  
      booked: true 
    });

    // Check if the historical place is in the booked historical places list
    const bookedHistPlaceIndex = tourist.BookedHistPlaces.findIndex(
      (place) => place.HistPlaceName === HPName
    );

    if (bookedHistPlaceIndex === -1) {
      return res.status(400).json({ msg: 'Historical place not found in booked activities. Please book the historical place event first.' });
    }

    // Calculate ticket price
    let ticketPrice;
    if (tourist.Occupation.toLowerCase() === 'student') {
      ticketPrice = hp.ticketPrices.student;
    } else if (tourist.Nationality.toLowerCase() === 'egyptian') {
      ticketPrice = hp.ticketPrices.native;
    } else {
      ticketPrice = hp.ticketPrices.foreigner;
    }

    // Update points and badge level
    if (tourist.BadgeLevelOfPoints === 1) {
      tourist.Points += 0.5 * ticketPrice;
      if (tourist.Points > 100000) {
        tourist.BadgeLevelOfPoints = 2;
      } else if (tourist.Points > 500000) {
        tourist.BadgeLevelOfPoints = 3;
      }
    } else if (tourist.BadgeLevelOfPoints === 2) {
      tourist.Points += ticketPrice;
      if (tourist.Points > 500000) {
        tourist.BadgeLevelOfPoints = 3;
      }
    } else if (tourist.BadgeLevelOfPoints === 3) {
      tourist.Points += 1.5 * ticketPrice;
    }

    // Save the updated tourist information
    await tourist.save();

    const transporter1 = nodemailer.createTransport({
      service: 'gmail', // You can use other email services if necessary
      auth: {
        user: 'malook25062003@gmail.com', // Your email
        pass: 'sxvo feuu woie gpfn', // Your email password or app-specific password
      },
    });
    
    // Create the email options
    const paymentDate = new Date();
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: tourist.Email,
      subject: 'Payment Receipt',
      text: `Dear ${touristUsername},
    
    Thank you for your payment for the itinerary "${HPName}".
    
    Here are the details of your transaction:
    - Activity Name: ${HPName}
    - Amount Paid: ${ticketPrice}
    - Payment Date: ${paymentDate.toLocaleDateString()}
    - Payment Time: ${paymentDate.toLocaleTimeString()}
    
    Thank you for choosing our service!
    
    Best regards,
    Beyond Borders`,
    };
    
    // Send the email
    await transporter1.sendMail(mailOptions);
    
    // Respond with success and remaining wallet balance
    res.status(200).json({
      msg: 'Payment successful! An email has been sent with your payment details.',
      hpName: hp.name,
      BadgeLevelOfPoints: tourist.BadgeLevelOfPoints,
      Points: tourist.Points,
    });
    } catch (error) {
    console.error('Error processing payment for hp:', error);
    res.status(500).json({ error: error.message });
    }
};

const payHPStripe = async (req, res) => {
  const { touristUsername, HPName } = req.body;

  try {
    const paymentMethodId = 'pm_card_visa'; // Replace with actual PaymentMethod ID from the frontend

    // Find the historical place by name
    const hp = await HistoricalPlacesModel.findOne({ name: HPName });
    if (!hp) {
      return res.status(404).json({ msg: 'Historical place not found' });
    }

    // Find the tourist by username
    const tourist = await TouristModel.findOne({ Username: touristUsername });
    if (!tourist) {
      return res.status(404).json({ msg: 'Tourist not found' });
    }

    // Calculate ticket price
    let ticketPrice;
    if (tourist.Occupation.toLowerCase() === 'student') {
      ticketPrice = hp.ticketPrices.student;
    } else if (tourist.Nationality.toLowerCase() === 'egyptian') {
      ticketPrice = hp.ticketPrices.native;
    } else {
      ticketPrice = hp.ticketPrices.foreigner;
    }

    // Process payment with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(ticketPrice * 100), // Convert to smallest currency unit
      currency: 'usd', // Change to 'egp' if your Stripe account supports EGP
      payment_method: paymentMethodId, // Payment method ID from the frontend
      confirm: true, // Automatically confirm the payment
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
    });

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ error: 'Payment failed. Please try again.' });
    }

    // Add historical place to tourist's booked list
    tourist.BookedHistPlaces.push({
      HistPlaceName: hp.name,
      booked: true,
    });

    // Update points and badge level
    if (tourist.BadgeLevelOfPoints === 1) {
      tourist.Points += 0.5 * ticketPrice;
      if (tourist.Points > 100000) {
        tourist.BadgeLevelOfPoints = 2;
      } else if (tourist.Points > 500000) {
        tourist.BadgeLevelOfPoints = 3;
      }
    } else if (tourist.BadgeLevelOfPoints === 2) {
      tourist.Points += ticketPrice;
      if (tourist.Points > 500000) {
        tourist.BadgeLevelOfPoints = 3;
      }
    } else if (tourist.BadgeLevelOfPoints === 3) {
      tourist.Points += 1.5 * ticketPrice;
    }

    await tourist.save();

    // Send payment receipt email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'malook25062003@gmail.com', // Your email
        pass: 'sxvo feuu woie gpfn', // Use app-specific password
      },
    });

    const paymentDate = new Date();
    const mailOptions = {
      from: 'malook25062003@gmail.com',
      to: tourist.Email,
      subject: 'Payment Receipt for Historical Place Booking',
      text: `Dear ${tourist.Username},

Thank you for your payment for the historical place "${HPName}".

Here are the details of your transaction:
- Historical Place Name: ${HPName}
- Amount Paid: ${ticketPrice} USD
- Payment Date: ${paymentDate.toLocaleDateString()}
- Payment Time: ${paymentDate.toLocaleTimeString()}

Thank you for choosing Beyond Borders!

Best regards,
Beyond Borders Team`,
    };

    await transporter.sendMail(mailOptions);

    // Respond with success
    res.status(200).json({
      msg: 'Payment successful! An email has been sent with your payment details.',
      hpName: hp.name,
      BadgeLevelOfPoints: tourist.BadgeLevelOfPoints,
      Points: tourist.Points,
    });
  } catch (error) {
    console.error('Error processing payment for historical place:', error);
    res.status(500).json({ error: 'Failed to process payment for historical place.' });
  }
};

/*const redeemPoints = async (req, res) => {
  const { username } = req.body;

  try {
    // Find the tourist by username
    const tourist = await TouristModel.findOne({ Username: username });
    if (!tourist) {
      return res.status(404).json({ msg: 'Tourist not found' });
    }

   

    // Calculate the redeemable amount (100 EGP for each 10000 points)
    const redeemableAmount = Math.floor(tourist.Points *100) /10000;

    // Deduct redeemed points and update the wallet
    tourist.Points = 0; // Remaining points after redemption
    tourist.Wallet += redeemableAmount;

    // Save the updated tourist information
    await tourist.save();

    // Respond with success and the updated wallet and points
    res.status(200).json({ 
      msg: 'Points redeemed successfully!', 
      walletBalance: tourist.Wallet, 
      remainingPoints: tourist.Points 
    });
  } catch (error) {
    console.error('Error redeeming points:', error);
    res.status(500).json({ error: error.message });
  }
};*/

const redeemPoints = async (req, res) => {
  const { username } = req.body;

  try {
    // Find the tourist by username
    const tourist = await TouristModel.findOne({ Username: username });
    if (!tourist) {
      return res.status(404).json({ msg: 'Tourist not found' });
    }

    // Check if points are redeemable (must be at least 10000)
    if (tourist.Points < 10000) {
      return res.status(400).json({ msg: 'Not enough points to redeem. Minimum required is 10,000 points.' });
    }

    // Calculate the redeemable amount (100 EGP for each 10000 points)
    const redeemableAmount = Math.floor(tourist.Points * 100) / 10000;

    // Deduct redeemed points and update the wallet
    tourist.Points = 0; // Remaining points after redemption
    tourist.Wallet += redeemableAmount;

    // Save the updated tourist information
    await tourist.save();

    // Respond with success and the updated wallet and points
    res.status(200).json({ 
      msg: 'Points redeemed successfully!', 
      walletBalance: tourist.Wallet, 
      remainingPoints: tourist.Points 
    });
  } catch (error) {
    console.error('Error redeeming points:', error);
    res.status(500).json({ error: error.message });
  }
};


function convertEgp(priceEgp, currency) {
  const price = 0;
  if(currency === "USD"){
     price = priceEgp / 49;

  }
  else if(currency === "EUR"){
     price = priceEgp / 53;
  }
  else{
     price = priceEgp;
  }
 
  return price.toFixed(2); // rounding to 2 decimal places
}





/*const fetchFlights = async (req, res) => {
  const { origin, destination, departureDate, arrivalDate } = req.body;

  // Validate input
  if (!origin || !destination || !departureDate || !arrivalDate) {
      return res.status(400).json({ msg: "Origin, destination, departure date, and arrival date are required." });
  }

  try {
      const apiKey = 'R7I0zjR1VKm8bGjuDyptuKbOobYnqoKu'; 
      const apiSecret =  'unDRSQSWZtYDRwS8'; 
      const tokenUrl = 'https://test.api.amadeus.com/v1/security/oauth2/token';
      const apiUrl = 'https://test.api.amadeus.com/v2/shopping/flight-offers';

      // Get access token
      const tokenResponse = await axios.post(tokenUrl, new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: apiKey,
          client_secret: apiSecret,
      }), {
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
          },
      });

      const accessToken = tokenResponse.data.access_token;

      // Fetch flight offers
      const flightResponse = await axios.get(apiUrl, {
          headers: {
              Authorization: Bearer ${accessToken},
          },
          params: {
              originLocationCode: origin,
              destinationLocationCode: destination,
              departureDate: departureDate,
              returnDate: arrivalDate,
              adults: 1,
          },
      });

      const flights = flightResponse.data.data;

      // Check if flights are found
      if (!flights || flights.length === 0) {
          return res.status(404).json({ msg: "No flights found for the given criteria." });
      }

      // Map flights to the desired structure, including flight ID and consolidating segments
      const flightDetailsArray = flights.map(flight => {
          return flight.itineraries.map(itinerary => ({
              flightID: flight.id, // Assuming each flight has a unique ID
              segments: itinerary.segments.map(segment => ({
                  departure: {
                      iataCode: segment.departure.iataCode,
                      terminal: segment.departure.terminal,
                      at: segment.departure.at,
                  },
                  arrival: {
                      iataCode: segment.arrival.iataCode,
                      terminal: segment.arrival.terminal,
                      at: segment.arrival.at,
                  }
              }))
          }));
      }).flat(); // Flatten the itineraries into a single array

      // Return the structured flight details
      res.status(200).json(flightDetailsArray);
  } catch (error) {
      console.error('Error fetching flights:', error);
      res.status(500).json({ msg: "An error occurred while fetching flights.", error: error.message });
  }
}; */ 

const fetchCityCode = async (req, res) => {
  const { cityName } = req.query; // Use req.query for GET requests

  // Validate input
  if (!cityName) {
      return res.status(400).json({ msg: "City name is required." });
  }

  try {
      const apiKey = 'R7I0zjR1VKm8bGjuDyptuKbOobYnqoKu';
      const apiSecret = 'unDRSQSWZtYDRwS8';
      const tokenUrl = 'https://test.api.amadeus.com/v1/security/oauth2/token';
      const locationUrl = 'https://test.api.amadeus.com/v1/reference-data/locations';

      // Get access token
      const tokenResponse = await axios.post(tokenUrl, new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: apiKey,
          client_secret: apiSecret,
      }), {
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
          },
      });

      const accessToken = tokenResponse.data.access_token;

      // Fetch city code
      const locationResponse = await axios.get(locationUrl, {
          headers: {
              Authorization: `Bearer ${accessToken}`,
          },
          params: {
              keyword: cityName,
              subType: 'CITY', // Ensures we're searching for cities
          },
      });

      const locations = locationResponse.data.data;

      // Check if city code is found
      if (!locations || locations.length === 0) {
          return res.status(404).json({ msg: `No city code found for the city: ${cityName}` });
      }

      // Extract the first matching city code
      const cityCode = locations[0].iataCode;

      // Log and return the city code
      console.log(`City: ${cityName}, Code: ${cityCode}`);
      res.status(200).json({ cityName, cityCode });
  } catch (error) {
      console.error('Error fetching city code:', error);
      res.status(500).json({ msg: "An error occurred while fetching the city code.", error: error.message });
  }
};




// Declare a global variable for storing flight details
let flightDetailsArray = []; // Static flight details array

const fetchFlights = async (req, res) => {
  const { origin, destination, departureDate, returnDate, adults, direct } = req.body;

  // Validate input
  if (!origin || !destination || !departureDate || !returnDate || !adults) {
      return res.status(400).json({ msg: "Origin, destination, departure date, return date, and number of adults are required." });
  }

  try {
      const apiKey = 'R7I0zjR1VKm8bGjuDyptuKbOobYnqoKu'; 
      const apiSecret = 'unDRSQSWZtYDRwS8'; 
      const tokenUrl = 'https://test.api.amadeus.com/v1/security/oauth2/token';
      const apiUrl = 'https://test.api.amadeus.com/v2/shopping/flight-offers';

      // Get access token
      const tokenResponse = await axios.post(tokenUrl, new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: apiKey,
          client_secret: apiSecret,
      }), {
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
          },
      });

      const accessToken = tokenResponse.data.access_token;

      // Fetch flight offers
      const flightResponse = await axios.get(apiUrl, {
          headers: {
              Authorization: `Bearer ${accessToken}`,
          },
          params: {
              originLocationCode: origin,
              destinationLocationCode: destination,
              departureDate: departureDate,
              returnDate: returnDate,
              adults: adults,
              nonStop: direct ? 'true' : undefined, // If direct is true, add nonStop parameter
          },
      });

      const flights = flightResponse.data.data;

      // Check if flights are found
      if (!flights || flights.length === 0) {
          return res.status(404).json({ msg: "No flights found for the given criteria." });
      }

      // Use an object to group by flightID
      const flightMap = {};

      flights.forEach(flight => {
          flight.itineraries.forEach(itinerary => {
              const flightDetails = {
                  flightID: flight.id,
                  price: flight.price.total,
                  currency: flight.price.currency,
                  segments: itinerary.segments.map(segment => ({
                      departure: {
                          iataCode: segment.departure.iataCode,
                          terminal: segment.departure.terminal,
                          at: segment.departure.at,
                      },
                      arrival: {
                          iataCode: segment.arrival.iataCode,
                          terminal: segment.arrival.terminal,
                          at: segment.arrival.at,
                      }
                  }))
              };

              // Add to flightMap based on flightID
              if (flightMap[flight.id]) {
                  flightMap[flight.id].push(flightDetails);
              } else {
                  flightMap[flight.id] = [flightDetails];
              }
          });
      });

      // Convert flightMap to an array of flights with the same flightID grouped together
      flightDetailsArray = Object.values(flightMap);

      // Log the flight details
      console.log("Flight details array updated:", flightDetailsArray);

      // Return the structured flight details
      res.status(200).json(flightDetailsArray);
  } catch (error) {
      console.error('Error fetching flights:', error);
      res.status(500).json({ msg: "An error occurred while fetching flights.", error: error.message });
  }
};

const bookFlight = async (req, res) => {
  const { touristUsername, flightID } = req.body;
  
  // Validate input
  if (!touristUsername || !flightID) {
      return res.status(400).json({ msg: "Tourist username and flight ID are required." });
  }

  try {
      // Fetch the tourist document by username
      const tourist = await TouristModel.findOne({ Username: touristUsername });
      if (!tourist) {
          return res.status(404).json({ msg: "Tourist not found." });
      }

      // Convert flightID to index (assuming flightID is 1-based)
      const index = parseInt(flightID, 10) - 1;

      // Check if index is valid
      if (index < 0 || index >= flightDetailsArray.length) {
          return res.status(404).json({ msg: "Flight not found." });
      }

      // Fetch flight details from flightDetailsArray using the calculated index
      const flightDetails = flightDetailsArray[index];

      // Create the booked flight entry
      const bookedFlight = {
          flightID: flightID,
          flightDetails: flightDetails,
          booked: true
      };

      // Add to bookedFlights array
      tourist.BookedFlights = tourist.BookedFlights || []; // Ensure BookedFlights array exists
      tourist.BookedFlights.push(bookedFlight);

      // Save the tourist document
      await tourist.save();

      res.status(200).json({ msg: "Flight booked successfully!", bookedFlight });
  } catch (error) {
      console.error('Error booking flight:', error);
      res.status(500).json({ msg: "An error occurred while booking the flight.", error: error.message });
  }
};


const viewBookedItineraries = async (req, res) => {
  const { touristUsername } = req.query; // Get the tourist's username from the query parameters

  try {
      // Find the tourist by their username
      const tourist = await TouristModel.findOne({ Username: touristUsername });
      
      if (!tourist) {
          return res.status(404).json({ msg: 'Tourist not found' });
      }

      // Check if the tourist has any booked itineraries
      if (!tourist.BookedItineraries || tourist.BookedItineraries.length === 0) {
          return res.status(200).json({ msg: 'No itineraries booked yet.' });
      }

      // Extract the itinerary names from the tourist's booked itineraries
      const bookedItineraryNames = tourist.BookedItineraries.map(itinerary => itinerary.ItineraryName);

      // Find the itineraries in the Itinerary model
      const activeItineraries = await ItineraryModel.find({ Title: { $in: bookedItineraryNames } });

      // Find the itineraries in the DeactivatedItinerariesModel
      const deactivatedItineraries = await DeactivatedItinerariesModel.find({ Title: { $in: bookedItineraryNames } });

      // Combine both active and deactivated itineraries
      const allBookedItineraries = [...activeItineraries, ...deactivatedItineraries];

      // Respond with the detailed list of all booked itineraries
      res.status(200).json({
          msg: 'Booked itineraries retrieved successfully',
          bookedItineraries: allBookedItineraries
      });
  } catch (error) {
      console.error('Error retrieving booked itineraries:', error);
      res.status(500).json({ error: error.message });
  }
};

const viewBookedActivities = async (req, res) => {
  const { touristUsername } = req.query; // Get the advertiser's username from the query parameters

  try {
      // Find the advertiser by their username
      const advertiser = await TouristModel.findOne({ Username: touristUsername });
      
      if (!advertiser) {
          return res.status(404).json({ msg: 'Tourist not found' });
      }

      // Check if the advertiser has any booked activities
      if (!advertiser.BookedActivities || advertiser.BookedActivities.length === 0) {
          return res.status(200).json({ msg: 'No activities booked yet.' });
      }

      // Extract the activity names from the advertiser's booked activities
      const bookedActivityNames = advertiser.BookedActivities.map(activity => activity.activityName);

      // Find the activities in the Activity model (for active activities)
      const activeActivities = await ActivityModel.find({ Name: { $in: bookedActivityNames } });

      // Find the activities in the DeactivatedActivitiesModel (for deactivated activities)
      const deactivatedActivities = await DeactivatedActivitiesModel.find({ Name: { $in: bookedActivityNames } });

      // Combine both active and deactivated activities
      const allBookedActivities = [...activeActivities, ...deactivatedActivities];

      // Respond with the detailed list of all booked activities
      res.status(200).json({
          msg: 'Booked activities retrieved successfully',
          bookedActivities: allBookedActivities
      });
  } catch (error) {
      console.error('Error retrieving booked activities:', error);
      res.status(500).json({ error: error.message });
  }
};


const requestDeleteAccountTourist = async (req, res) => {
  try {
      const { Username } = req.body;  
      await DeleteRequestsModel.create({Username : Username,Type: "Tourist"});
      res.status(200).json({ msg: "You have reqeuested to delete your account, an admin will view your request!" });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};



async function convertCurrency(priceEgp, targetCurrency) {
    const apiKey = 'ae43cffa2c28efd24e159e2a'; 
    const apiUrl = `https://api.exchangerate-api.com/v4/latest/EGP`; //  EGP base currency

    try {
        // Fetch exchange rates
        const response = await axios.get(apiUrl, { params: { access_key: apiKey } });
        const rates = response.data.rates;

        // Check if the target currency exists in the response
        if (!rates[targetCurrency]) {
            throw new Error(`Currency ${targetCurrency} not supported.`);
        }

        // Convert the price to the target currency
        const convertedPrice = priceEgp * rates[targetCurrency];
        return convertedPrice.toFixed(2); // rounding to 2 decimal places
    } catch (error) {
        console.error('Error converting currency:', error.message);
        throw error;
    }
}

const convertCurr = async (req, res) => {
  const { priceEgp, targetCurrency } = req.body;

  if (!priceEgp || !targetCurrency) {
      return res.status(400).json({ error: 'Please provide both priceEgp and targetCurrency in the request body.' });
  }

  try {
      // Call the convertCurrency function
      const convertedPrice = await convertCurrency(priceEgp, targetCurrency);

      // Respond with the converted price
      res.status(200).json({ convertedPrice, currency: targetCurrency });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};


const getActivityDetails = async (req, res) => {
  const { activityName } = req.params; // Get activity name from the route parameter

  try {
    // Find the activity by name, excluding the RatingCount field
    console.log("Searching for activity:", activityName); // Add this line

    const activity = await ActivityModel.findOne({ Name: activityName }).select('-RatingCount');

    // If no activity is found, return a 404 response
    if (!activity) {
      return res.status(404).json({ msg: 'Activity not found' });
    }

    // Respond with the activity details, excluding RatingCount
    res.status(200).json(activity);
  } catch (error) {
    console.error('Error fetching activity details:', error);
    res.status(500).json({ error: error.message });
  }
};

const getHistoricalPlaceDetails = async (req, res) => {
  const { HPname } = req.params; // Get historical place name from the route parameter

  try {
    // Find the historical place by name, excluding the RatingCount field
    const place = await HistoricalPlacesModel.findOne({ name: HPname }).select('-RatingCount');
    
    // If no historical place is found, return a 404 response
    if (!place) {
      return res.status(404).json({ msg: 'Historical place not found' });
    }

    // Respond with the historical place details, excluding RatingCount
    res.status(200).json(place);
  } catch (error) {
    console.error('Error fetching historical place details:', error);
    res.status(500).json({ error: error.message });
  }
};

const getMuseumDetails = async (req, res) => {
  const { museumName } = req.params; // Get museum name from the route parameter

  try {
    const museum = await MuseumModel.findOne({ name: museumName }).select('-RatingCount');
    
    if (!museum) {
      return res.status(404).json({ msg: 'Museum not found' });
    }

    res.status(200).json(museum);
  } catch (error) {
    console.error('Error fetching museum details:', error);
    res.status(500).json({ error: error.message });
  }
};

const getItineraryDetails = async (req, res) => {
  const { itineraryName } = req.params; // Get itinerary name from the route parameter

  try {
    // Find the itinerary by name, excluding the RatingCount field
    const itinerary = await ItineraryModel.findOne({ Title: itineraryName }).select('-RatingCount');
    
    // If no itinerary is found, return a 404 response
    if (!itinerary) {
      return res.status(404).json({ msg: 'Itinerary not found' });
    }

    // Respond with the itinerary details, excluding RatingCount
    res.status(200).json(itinerary);
  } catch (error) {
    console.error('Error fetching itinerary details:', error);
    res.status(500).json({ error: error.message });
  }
};


function copyToClipboard(entityType, entityName) {
  const baseUrl = 'http://localhost:8000';
 
  // Construct the URL based on the entity type and name
  let url;
  if (entityType === 'activity') {
    url = `${baseUrl}/api/activity/details/${encodeURIComponent(entityName)}`;
  } else if (entityType === 'historicalPlace') {
    url = `${baseUrl}/api/historicalPlace/details/${encodeURIComponent(entityName)}`;
  } else if (entityType === 'museum') {
    url = `${baseUrl}/api/museum/details/${encodeURIComponent(entityName)}`;
  } else if (entityType === 'itinerary') { // Added itinerary entity type
    url = `${baseUrl}/api/itinerary/details/${encodeURIComponent(entityName)}`;
  } else {
    console.error('Invalid entity type');
    return;
  }

  // Uncomment to enable clipboard copying functionality
  // navigator.clipboard.writeText(url)
  //   .then(() => {
  //     alert(`Link copied to clipboard: ${url}`);
  //   })
  //   .catch(err => {
  //     console.error('Failed to copy link: ', err);
  //   });

  return url;
}

 
 
 async function sendEmailLink(email, url) {
   const transporter = nodemailer.createTransport({
     service: 'gmail', // Use your email provider
     auth: {
       user: 'malook25062003@gmail.com', // Your email
       pass: 'sxvo feuu woie gpfn' // Your email password or app password
     }
   });
 
   const mailOptions = {
     from: 'malook25062003@gmail.com',
     to: email,
     subject: 'Check out this link',
     text: `Here is the link: ${url}`
   };
 
   await transporter.sendMail(mailOptions);
 }
 
 
 // const GetCopyLink1 = (req, res) => {
 //   try {
 //     const { entityType, entityName } = req.body;
 //     const url = copyToClipboard(entityType, entityName);
 //     res.json({ link: url });
 //   } catch (error) {
 //     res.status(400).json({ error: error.message });
 //   }
 // };
 
 const GetCopyLink = async (req, res) => {
   try {
     const { entityType, entityName, email } = req.body;
     const url = copyToClipboard(entityType, entityName);
 
     if (email) {
       // Send the link via email
       await sendEmailLink(email, url);
       res.json({ msg: 'Link sent via email!', link: url });
     } else {
       // Just respond with the link for copy
       res.json({ link: url });
     }
   } catch (error) {
     console.error('Error generating or sending link:', error);
     res.status(400).json({ error: error.message });
   }
 };

let ids = []; // Global array to store hotel IDs 

const fetchHotelsByCity = async (req, res) => {
  const { city } = req.body;

  if (!city) {
    return res.status(400).json({ msg: "City is required." });
  }

  try {
    const apiKey = 'coV6zP2rQpSuABna194UYUn6PlHJet5W'; 
    const apiSecret = 'Ge69t12kvkB4uprY';
    const tokenUrl = 'https://test.api.amadeus.com/v1/security/oauth2/token';
    const apiUrl = 'https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city';

    // Get access token
    const tokenResponse = await axios.post(tokenUrl, new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: apiKey,
      client_secret: apiSecret,
    }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const accessToken = tokenResponse.data.access_token;

    // Fetch hotel offers
    const hotelResponse = await axios.get(apiUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { cityCode: city },
    });

    const hotels = hotelResponse.data.data;

    if (!hotels || hotels.length === 0) {
      return res.status(404).json({ msg: "No hotels found for the given criteria." });
    }

    // Clear previous ids and push new hotel IDs into the global array
    ids = []; // Clear previous hotel IDs
    hotels.forEach(hotel => ids.push(String(hotel.hotelId)));  // Use push to add each ID
    console.log('Hotel IDs after fetching:', ids);

    res.status(200).json(ids);
  } catch (error) {
    console.error('Error fetching hotels:', error.response ? error.response.data : error.message);
    res.status(500).json({ msg: "An error occurred while fetching hotels.", error: error.message });
  }
};



// Helper function to split ids into smaller batches
let hotelOffers = [];

const fetchHotels = async (req, res) => {
  const { adults, checkInDate, checkOutDate } = req.body;
  hotelOffers = [];

  // Validate input
  if (!ids.length || !checkInDate || !checkOutDate) {
    return res.status(400).json({ msg: "Hotel IDs, check-in date, and check-out date are required." });
  }

  try {
    const apiKey = 'coV6zP2rQpSuABna194UYUn6PlHJet5W';
    const apiSecret = 'Ge69t12kvkB4uprY';
    const tokenUrl = 'https://test.api.amadeus.com/v1/security/oauth2/token';
    const apiUrl = 'https://test.api.amadeus.com/v3/shopping/hotel-offers';

    // Get access token
    const tokenResponse = await axios.post(tokenUrl, new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: apiKey,
      client_secret: apiSecret,
    }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const accessToken = tokenResponse.data.access_token;

    // Limit the ids array to the first 50 elements and join them into a comma-separated string
    const hotelIdsString = ids.slice(0, 50).join(',');

    // Fetch offers for the batch of hotel IDs
    const hotelResponse = await axios.get(apiUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: {
        hotelIds: hotelIdsString,
        checkInDate: checkInDate,
        checkOutDate: checkOutDate,
        adults: adults,
      },
    });

    const offers = hotelResponse.data.data;

    console.log('Offers Response:', offers); // Log the full response for debugging

    if (offers && offers.length > 0) {
      offers.forEach((offer) => {
        if (offer.offers && offer.offers.length > 0) {
          // Map room offers and include additional details
          const roomDetails = offer.offers.map((room) => ({
            hotelNumber: hotelOffers.length + 1,
            bedType: room.room?.typeEstimated?.bedType || "N/A",
            policies: room.policies || {}, // Include policies
            price: room.price?.total || "N/A",
            currency: room.price?.currency || "N/A",
            boardType: room.boardType || "N/A",
            checkInDate: room.checkInDate || checkInDate,
            checkOutDate: room.checkOutDate || checkOutDate,
          }));

          // Build hotel details
          const hotelDetails = {
            hotelName: offer.hotel.name,
            cityCode: offer.hotel.cityCode || "N/A",
            roomOffers: roomDetails,
          };

          hotelOffers.push(hotelDetails);
        } else {
          console.log(`No offers found for hotel: ${offer.hotel.name}`);
        }
      });
    } else {
      console.log('No offers found.');
    }

    if (hotelOffers.length === 0) {
      return res.status(404).json({ msg: "No hotel offers found for the given criteria." });
    }

    console.log('Hotel offers:', hotelOffers[0]);
    res.status(200).json(hotelOffers);
  } catch (error) {
    console.error('Error fetching hotels:', error.response ? error.response.data : error.message);
    res.status(500).json({ msg: "An error occurred while fetching hotels.", error: error.message });
  }
};




const bookHotel = async (req, res) => {
  const { hotelNumber, touristUsername } = req.body;

  // Validate input
  if (!touristUsername || !hotelNumber) {
      return res.status(400).json({ msg: "Tourist username and hotel number are required." });
  }

  try {
      // Fetch the tourist document by username
      const tourist = await TouristModel.findOne({ Username: touristUsername });
      if (!tourist) {
          return res.status(404).json({ msg: "Tourist not found." });
      }

      // Convert hotelNumber to index (assuming hotelNumber is 1-based)
      const index = parseInt(hotelNumber, 10) - 1;

      // Check if index is valid
      if (index < 0 || index >= hotelOffers.length) {
          return res.status(404).json({ msg: "Hotel not found." });
      }

      // Fetch hotel details from hotelOffers using the calculated index
      const hotelDetails = hotelOffers[index];

      // Create the booked hotel entry
      const bookedHotel = {
          hotelID: hotelDetails.hotelID, // Assuming hotelDetails contains hotelID
          hotelDetails: hotelDetails,
      };

      // Add to bookedHotels array
      tourist.BookedHotels = tourist.BookedHotels || []; // Ensure BookedHotels array exists
      tourist.BookedHotels.push(bookedHotel);

      // Save the tourist document
      await tourist.save();

      res.status(200).json({ msg: "Hotel booked successfully!", bookedHotel });
  } catch (error) {
      console.error('Error booking hotel:', error);
      res.status(500).json({ msg: "An error occurred while booking the hotel.", error: error.message });
  }
};


const bookTransportation = async (req, res) => {
  const { touristUsername, TranspName } = req.body;

  try {
    
    const transportation = await TransportationModel.findOne({ serviceName: TranspName });
    
    if (!transportation) {
      return res.status(404).json({ msg: 'transportation not found' });
    }
    
    if (transportation.available===false) {
      return res.status(404).json({ msg: 'Transportation not Available' });
    }
    
    const tourist = await TouristModel.findOne({ Username: touristUsername });
    
    if (!tourist) {
      return res.status(404).json({ msg: 'Tourist not found' });
    }

    //tourist's age
    const today = new Date();
    const birthDate = new Date(tourist.DoB);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    
    if (age < 18) {
      return res.status(403).json({ msg: 'You must be 18 or older to book an activity.' });
    }

    
    if (!tourist.BookedTransportation) {
      tourist.BookedTransportation = [];
    }
    
    transportation.capacity=transportation.capacity-1;
    if(transportation.capacity===0){
      transportation.available = false;
    }
    
   
    tourist.BookedTransportation.push({
      TransportationName: transportation.serviceName 
    });

    await transportation.save();
    await tourist.save();

    
    res.status(201).json({ msg: 'transportation booked successfully!', TranspName: transportation.serviceName, totalCost: transportation.price});
  } catch (error) {
    console.error('Error booking transp:', error);
    res.status(500).json({ error: error.message });
  }
};


const addPreferences = async (req, res) => {
  const { touristUsername, preferences } = req.body;

  // Validate input
  if (!touristUsername || !Array.isArray(preferences) || preferences.length === 0) {
    return res.status(400).json({ msg: "Tourist username and preferences array are required." });
  }

  try {
    // Fetch the tourist document by username
    const tourist = await TouristModel.findOne({ Username: touristUsername });
    if (!tourist) {
      return res.status(404).json({ msg: "Tourist not found." });
    }

    // Add each preference to MyPreferences, avoiding duplicates
    preferences.forEach(preference => {
      if (!tourist.MyPreferences.includes(preference)) {
        tourist.MyPreferences.push(preference);
      }
    });

    // Save the updated tourist document
    await tourist.save();

    res.status(200).json({ msg: "Preferences added successfully!", preferences: tourist.MyPreferences });
  } catch (error) {
    console.error('Error adding preferences:', error);
    res.status(500).json({ msg: "An error occurred while adding preferences.", error: error.message });
  }
};

const viewMyCompletedActivities = async (req, res) => {
  // Retrieve the Username from the request query
  const { Username } = req.query;

  try {
      // Find the tourist by Username
      const user = await TouristModel.findOne({ Username });

      // If no user is found, send a 404 response
      if (!user) {
          return res.status(404).json({ msg: "Tourist not found" });
      }

      // Extract the activity names from completedActivities array
      const activityNames = user.completedActivities.map(activity => activity.ActivityName);
      console.log(activityNames);

      // Find the details of each completed activity in the Activity model
      const completedActivitiesDetails = await ActivityModel.find({ Name: { $in: activityNames } });
      console.log(completedActivitiesDetails);
      // Send the completed activities' details as a JSON response
      res.status(200).json(completedActivitiesDetails);
  } catch (error) {
      // If an error occurs, send a 400 Bad Request status with the error message
      res.status(400).json({ error: error.message });
  }
};

const viewMyCompletedItineraries = async (req, res) => {
  // Retrieve the Username from the request body
  const { Username } = req.query;

  try {
      // Find the tourist by Username
      const user = await TouristModel.findOne({ Username });

      // If no user is found, send a 404 response
      if (!user) {
          return res.status(404).json({ msg: "Tourist not found" });
      }

      // Extract the itinerary names from completedItineraries array
      const itineraryNames = user.completedItineraries.map(itinerary => itinerary.ItineraryName);
      console.log(itineraryNames);

      // Find the details of each completed itinerary in the Itinerary model
      const completedItinerariesDetails = await ItineraryModel.find({ Title: { $in: itineraryNames } });
      console.log(completedItinerariesDetails);

      // Send the completed itineraries' details as a JSON response
      res.status(200).json(completedItinerariesDetails);
  } catch (error) {
      // If an error occurs, send a 400 Bad Request status with the error message
      res.status(400).json({ error: error.message });
  }
};

const viewMyCompletedMuseums = async (req, res) => {
  // Retrieve the Username from the request body
  const { Username } = req.query;

  try {
      // Find the tourist by Username
      const user = await TouristModel.findOne({ Username });

      // If no user is found, send a 404 response
      if (!user) {
          return res.status(404).json({ msg: "Tourist not found" });
      }

      // Extract the museum names from completedMuseumEvents array
      const museumNames = user.completedMuseumEvents.map(museum => museum.MuseumName);
      console.log(museumNames);

      // Find the details of each completed museum visit in the Museum model
      const completedMuseumsDetails = await MuseumModel.find({ name: { $in: museumNames } });
      console.log(completedMuseumsDetails);

      // Send the completed museums' details as a JSON response
      res.status(200).json(completedMuseumsDetails);
  } catch (error) {
      // If an error occurs, send a 400 Bad Request status with the error message
      res.status(400).json({ error: error.message });
  }
};

const viewMyCompletedHistoricalPlaces = async (req, res) => {
  // Retrieve the Username from the request body
  const { Username } = req.query;

  try {
      // Find the tourist by Username
      const user = await TouristModel.findOne({ Username });

      // If no user is found, send a 404 response
      if (!user) {
          return res.status(404).json({ msg: "Tourist not found" });
      }

      // Extract the historical place names from completedHistoricalPlaceEvent array
      const historicalPlaceNames = user.completedHistoricalPlaceEvent.map(place => place.HistoricalPlaceName);
      console.log(historicalPlaceNames);

      // Find the details of each completed historical place visit in the HistoricalPlace model
      const completedHistoricalPlacesDetails = await HistoricalPlacesModel.find({ name: { $in: historicalPlaceNames } });
      console.log(completedHistoricalPlacesDetails);

      // Send the completed historical places' details as a JSON response
      res.status(200).json(completedHistoricalPlacesDetails);
  } catch (error) {
      // If an error occurs, send a 400 Bad Request status with the error message
      res.status(400).json({ error: error.message });
  }
};


const viewMyBookedActivities = async (req, res) => {
  // Retrieve the Username from the request query
  const { Username } = req.query;

  try {
      // Find the tourist by Username
      const user = await TouristModel.findOne({ Username });

      // If no user is found, send a 404 response
      if (!user) {
          return res.status(404).json({ msg: "Tourist not found" });
      }

      // Extract the activity names from BookedActivities array
      const activityNames = user.BookedActivities.map(activity => activity.activityName);
      console.log(activityNames);

      // Find the details of each booked activity in the Activity model
      const bookedActivitiesDetails = await ActivityModel.find({ Name: { $in: activityNames } });
      console.log(bookedActivitiesDetails);
      // Send the booked activities' details as a JSON response
      res.status(200).json(bookedActivitiesDetails);
  } catch (error) {
      // If an error occurs, send a 400 Bad Request status with the error message
      res.status(400).json({ error: error.message });
  }
};


const viewMyBookedItineraries = async (req, res) => {
  // Retrieve the Username from the request body
  const { Username } = req.query;

  try {
      // Find the tourist by Username
      const user = await TouristModel.findOne({ Username });

      // If no user is found, send a 404 response
      if (!user) {
          return res.status(404).json({ msg: "Tourist not found" });
      }

      // Extract the itinerary names from BookedItineraries array
      const itineraryNames = user.BookedItineraries.map(itinerary => itinerary.ItineraryName);
      console.log(itineraryNames);

      // Find the details of each completed itinerary in the Itinerary model
      const bookedItinerariesDetails = await ItineraryModel.find({ Title: { $in: itineraryNames } });
      console.log(bookedItinerariesDetails);

      // Send the completed itineraries' details as a JSON response
      res.status(200).json(bookedItinerariesDetails);
  } catch (error) {
      // If an error occurs, send a 400 Bad Request status with the error message
      res.status(400).json({ error: error.message });
  }
};

const viewMyBookedMuseums = async (req, res) => {
  // Retrieve the Username from the request body
  const { Username } = req.query;

  try {
      // Find the tourist by Username
      const user = await TouristModel.findOne({ Username });

      // If no user is found, send a 404 response
      if (!user) {
          return res.status(404).json({ msg: "Tourist not found" });
      }

      // Extract the museum names from completedMuseumEvents array
      const museumNames = user.BookedMuseums.map(museum => museum.MuseumName);
      console.log(museumNames);

      // Find the details of each completed museum visit in the Museum model
      const bookedMuseumsDetails = await MuseumModel.find({ name: { $in: museumNames } });
      console.log(bookedMuseumsDetails);

      // Send the completed museums' details as a JSON response
      res.status(200).json(bookedMuseumsDetails);
  } catch (error) {
      // If an error occurs, send a 400 Bad Request status with the error message
      res.status(400).json({ error: error.message });
  }
};

const viewMyBookedHistoricalPlaces = async (req, res) => {
  // Retrieve the Username from the request body
  const { Username } = req.query;

  try {
      // Find the tourist by Username
      const user = await TouristModel.findOne({ Username });

      // If no user is found, send a 404 response
      if (!user) {
          return res.status(404).json({ msg: "Tourist not found" });
      }

      // Extract the historical place names from completedHistoricalPlaceEvent array
      const historicalPlaceNames = user.BookedHistPlaces.map(place => place.HistPlaceName);
      console.log(historicalPlaceNames);

      // Find the details of each completed historical place visit in the HistoricalPlace model
      const bookedHistoricalPlacesDetails = await HistoricalPlacesModel.find({ name: { $in: historicalPlaceNames } });
      console.log(bookedHistoricalPlacesDetails);

      // Send the completed historical places' details as a JSON response
      res.status(200).json(bookedHistoricalPlacesDetails);
  } catch (error) {
      // If an error occurs, send a 400 Bad Request status with the error message
      res.status(400).json({ error: error.message });
  }
};

const viewTourGuidesCompleted = async (req, res) => {
  const { Username } = req.query;

  try {
    // Find the tourist by Username
    const tourist = await TouristModel.findOne({ Username });

    // If no user is found, send a 404 response
    if (!tourist) {
      return res.status(404).json({ msg: "Tourist not found" });
    }

    // Get completed itinerary names from the tourist's record
    const completedItineraries = tourist.completedItineraries.map(itinerary => itinerary.ItineraryName);

    // Find the itineraries in the database with the matching names
    const itineraryDetails = await ItineraryModel.find({ Title: { $in: completedItineraries } });

    // Get unique tour guide usernames from the found itineraries
    const tourGuideUsernames = itineraryDetails.map(itinerary => itinerary.AuthorUsername);
    //const uniqueTourGuideUsernames = [...new Set(tourGuideUsernames)]; // Remove duplicates

    // Retrieve the tour guide details for each unique username
    const tourGuides = await TourGuideModel.find({ Username: { $in: tourGuideUsernames } });

    // Send the tour guide details as a JSON response
    res.status(200).json(tourGuides);
  } catch (error) {
    // Handle any errors
    res.status(400).json({ error: error.message });
  }
};

const viewAllTransportation = async (req, res) => {
  try {
    // Fetch all transportation options from the TransportationModel
    const transportationOptions = await TransportationModel.find();

    // Send the transportation options as a JSON response
    res.status(200).json(transportationOptions);
  } catch (error) {
    // Handle any errors that occur during the fetch
    res.status(400).json({ error: error.message });
  }
};

const viewPreferenceTags = async (req, res) => {
  try {
    // Fetch all tags from the database
    const tags = await TagsModel.find(); 

    // Check if there are any tags
    if (tags.length === 0) {
      return res.status(404).json({ msg: 'No preference tags found' });
    }

    // Respond with the list of tags
    res.status(200).json(tags);
  } catch (error) {
    console.error('Error fetching preference tags:', error);
    res.status(500).json({ error: error.message });
  }
};

const viewPurchasedProducts = async (req, res) => {
  // Retrieve the Username from the request body
  const { Username } = req.query;

  try {
      // Find the tourist by Username
      const user = await TouristModel.findOne({ Username });

      // If no user is found, send a 404 response
      if (!user) {
          return res.status(404).json({ msg: "Tourist not found" });
      }

      // Extract the museum names from completedMuseumEvents array
      const productName = user.purchasedProducts.map(product => product.productName);
      console.log(productName);

      // Find the details of each completed museum visit in the Museum model
      const purchasedProductDetails = await ProductModel.find({ Name: { $in: productName } });
      console.log(purchasedProductDetails);

      // Send the completed museums' details as a JSON response
      res.status(200).json(purchasedProductDetails);
  } catch (error) {
      // If an error occurs, send a 400 Bad Request status with the error message
      res.status(400).json({ error: error.message });
  }
};

const viewMyBookedTransportation = async (req, res) => {
  // Retrieve the Username from the request query
  const { Username } = req.query;

  try {
      // Find the tourist by Username
      const user = await TouristModel.findOne({ Username });

      // If no user is found, send a 404 response
      if (!user) {
          return res.status(404).json({ msg: "Tourist not found" });
      }

      // Extract the transportation names from BookedTransportation array
      const transportationNames = user.BookedTransportation.map(transportation => transportation.TransportationName);
      console.log(transportationNames);

      // Find the details of each booked transportation in the Transportation model
      const bookedTransportationDetails = await TransportationModel.find({ serviceName: { $in: transportationNames } });
      console.log(bookedTransportationDetails);

      // Send the booked transportation details as a JSON response
      res.status(200).json(bookedTransportationDetails);
  } catch (error) {
      // If an error occurs, send a 400 Bad Request status with the error message
      res.status(400).json({ error: error.message });
  }
};

const sendOtp = async (req, res) => {
  const { touristUsername } = req.body;

  try {
    // Find the tourist by username to get their email
    const tourist = await TouristModel.findOne({ Username: touristUsername });
    if (!tourist) {
      throw new Error('Tourist not found');
    }

    const email = tourist.Email;

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Check if the Username already exists in UserOTP
    let userOtpEntry = await UserOTPModel.findOne({ Username: touristUsername });
    
    if (userOtpEntry) {
      // Update the OTP if the Username exists
      userOtpEntry.OTP = otp;
      await userOtpEntry.save();
    } else {
      // Create a new UserOTP entry if the Username doesn't exist
      userOtpEntry = new UserOTPModel({
        Username: touristUsername,
        OTP: otp
      });
      await userOtpEntry.save();
    }

    // Set up the email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Adjust based on your email provider
      auth: {
        user: 'malook25062003@gmail.com', // Your email
        pass: 'sxvo feuu woie gpfn'        // Your email password or app-specific password
      },
    });

    // Configure the email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Dear ${touristUsername},

          Here is your OTP code: ${otp}

          Please use this code to proceed.

          Best regards,
          Beyond Borders`
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    console.log('OTP sent:', otp);

    res.status(200).json({ msg: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
};

const loginTouristOTP = async (req, res) => {
  try {
    const { username, OTP } = req.body;

    // Validate input
    if (!username || !OTP) {
      return res.status(400).json({ error: "Username and OTP are required." });
    }

    // Find the tourist by username
    const tourist = await TouristModel.findOne({ Username: username });
    if (!tourist) {
      return res.status(401).json({ error: "Invalid username." });
    }

    // Find the OTP entry for the username
    const userOTP = await UserOTPModel.findOne({ Username: username });
    if (!userOTP) {
      return res.status(401).json({ error: "OTP not found. Please request a new one." });
    }

    // Check if the OTP matches
    if (userOTP.OTP !== parseInt(OTP)) { // Ensure both are numbers for comparison
      return res.status(401).json({ error: "Invalid OTP." });
    }

    // Successful authentication
    res.status(200).json({ message: "Login successful!", tourist });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const addBookmark = async (req, res) => {
  const { touristUsername, eventName } = req.body;

  try {
    const tourist = await TouristModel.findOne({ Username: touristUsername });

    if (!tourist) {
      return res.status(404).json({ msg: 'Tourist not found' });
    }

    const activity = await ActivityModel.findOne({ Name: eventName });
    const itinerary = await ItineraryModel.findOne({Title:eventName });
    const hp = await HistoricalPlacesModel.findOne({name:eventName});
    const museum = await MuseumModel.findOne({name:eventName});

    if (!activity && !itinerary && !hp && !museum) {
       return res.status(404).json({ msg: 'Event not found' });
    }
   
    tourist.BookmarkedEvents.push({
      EventName: eventName
    });

    
    await tourist.save();

    res.status(201).json({ msg: 'Event Saved!', EventName:eventName});
  } catch (error) {
    console.error('Error saving bookmark:', error);
    res.status(500).json({ error: error.message });
  }
};

const viewBookmarks = async (req, res) => {
  const { touristUsername } = req.query;

  try {
    // Find the tourist by username
    const tourist = await TouristModel.findOne({ Username: touristUsername });

    if (!tourist) {
      return res.status(404).json({ msg: 'Tourist not found' });
    }

    // Get the bookmarked event names
    const bookmarkedEventNames = tourist.BookmarkedEvents.map((event) => event.EventName);

    // Fetch events from the respective models
    const activities = await ActivityModel.find({ Name: { $in: bookmarkedEventNames } });
    const itineraries = await ItineraryModel.find({ Title: { $in: bookmarkedEventNames } });
    const historicalPlaces = await HistoricalPlacesModel.find({ name: { $in: bookmarkedEventNames } });
    const museums = await MuseumModel.find({ name: { $in: bookmarkedEventNames } });

    // Combine all the found events
    const allBookmarkedEvents = [
      ...activities.map((activity) => ({ type: 'Activity', details: activity })),
      ...itineraries.map((itinerary) => ({ type: 'Itinerary', details: itinerary })),
      ...historicalPlaces.map((hp) => ({ type: 'Historical Place', details: hp })),
      ...museums.map((museum) => ({ type: 'Museum', details: museum })),
    ];

    // Check if any events were found
    if (allBookmarkedEvents.length === 0) {
      return res.status(404).json({ msg: 'No bookmarked events found.' });
    }

    // Respond with the combined bookmarked events
    res.status(200).json(allBookmarkedEvents);
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    res.status(500).json({ error: error.message });
  }
};

const addToWishList = async (req, res) => {
  const { touristUsername, productName } = req.body;

  try {
    // Find the tourist by username
    const tourist = await TouristModel.findOne({ Username: touristUsername });
    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    // Check if the product exists in the Product model
    const product = await ProductModel.findOne({ Name: productName });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Check if the product is already in the wishlist to avoid duplicates
    const isProductInWishlist = tourist.WishList.some(
      (item) => item.productName === productName
    );
    if (isProductInWishlist) {
      return res.status(400).json({ error: "Product is already in the wishlist" });
    }

    // Add the product to the WishList array
    tourist.WishList.push({ productName });

    // Save the updated tourist document
    await tourist.save();

    // Send a success response with updated tourist data
    res.status(200).json({ msg: "Product added to wishlist successfully", tourist });
  } catch (error) {
    console.error("Error adding product to wishlist:", error);
    res.status(500).json({ error: "Failed to add product to wishlist" });
  }
};

const checkIfInWishlist = async (req, res) => {
  const { touristUsername, productName } = req.query; // Retrieve parameters from the query

  try {
    // Find the tourist by username
    const tourist = await TouristModel.findOne({ Username: touristUsername });

    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    // Check if the product is in the wishlist
    const isInWishlist = tourist.WishList.some(
      (item) => item.productName === productName
    );

    // Return the result
    res.status(200).json({ inWishlist: isInWishlist });
  } catch (error) {
    console.error("Error checking wishlist:", error);
    res.status(500).json({ error: "Failed to check wishlist status" });
  }
};


const viewMyWishlist = async (req, res) => {
  const { touristUsername } = req.query;

  try {
    // Find the tourist by username
    const tourist = await TouristModel.findOne({ Username: touristUsername });
    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    // Retrieve and send the wishlist
    res.status(200).json({ WishList: tourist.WishList });
  } catch (error) {
    console.error("Error retrieving wishlist:", error);
    res.status(500).json({ error: "Failed to retrieve wishlist" });
  }
};

const removeFromWishlist = async (req, res) => {
  const { touristUsername, productName } = req.body;

  try {
    // Find the tourist by username
    const tourist = await TouristModel.findOne({ Username: touristUsername });
    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    // Check if the product is in the wishlist
    const productIndex = tourist.WishList.findIndex(
      (item) => item.productName === productName
    );
    if (productIndex === -1) {
      return res.status(404).json({ error: "Product not found in wishlist" });
    }

    // Remove the product from the wishlist
    tourist.WishList.splice(productIndex, 1);

    // Save the updated tourist document
    await tourist.save();

    // Send a success response
    res.status(200).json({ msg: "Product removed from wishlist successfully", WishList: tourist.WishList });
  } catch (error) {
    console.error("Error removing product from wishlist:", error);
    res.status(500).json({ error: "Failed to remove product from wishlist" });
  }
};

const addToCartFromWishlist = async (req, res) => {
  const { touristUsername, productName } = req.body;

  try {
    // Find the tourist by username
    const tourist = await TouristModel.findOne({ Username: touristUsername });
    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    // Check if the product exists in the WishList
    const wishlistIndex = tourist.WishList.findIndex(
      (item) => item.productName === productName
    );
    if (wishlistIndex === -1) {
      return res.status(404).json({ error: "Product not found in wishlist" });
    }

    // Find the product in the ProductModel to get the available stock
    const product = await ProductModel.findOne({ Name: productName });
    if (!product) {
      return res.status(404).json({ error: "Product not found in ProductModel" });
    }

    // Check if the product is already in the Cart
    const productInCart = tourist.Cart.find(
      (item) => item.productName === productName
    );

    // Calculate the new quantity after adding to the cart
    const newQuantityInCart = productInCart ? productInCart.Quantity + 1 : 1;

    // Check if the new quantity exceeds the available stock
    if (newQuantityInCart > product.Quantity) {
      return res.status(400).json({ error: `Only ${product.Quantity} units of '${productName}' are available.` });
    }

    // Add to cart or increment the quantity if it’s within stock limits
    if (productInCart) {
      productInCart.Quantity += 1;
    } else {
      tourist.Cart.push({ productName, Quantity: 1 });
    }

    // Remove the product from the WishList
    tourist.WishList.splice(wishlistIndex, 1);

    // Save the updated tourist document
    await tourist.save();

    // Send a success response with updated cart and wishlist data
    res.status(200).json({
      msg: "Product added to cart and removed from wishlist successfully",
      Cart: tourist.Cart,
      WishList: tourist.WishList
    });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res.status(500).json({ error: "Failed to add product to cart" });
  }
};


const addToCart = async (req, res) => {
  const { touristUsername, productName } = req.body;

  try {
    // Find the tourist by username
    const tourist = await TouristModel.findOne({ Username: touristUsername });
    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    // Find the product in the ProductModel
    const product = await ProductModel.findOne({ Name: productName });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Check if the product is already in the Cart
    const productInCart = tourist.Cart.find(
      (item) => item.productName === productName
    );

    // Calculate the new quantity if the product is already in the cart
    const newQuantityInCart = productInCart ? productInCart.Quantity + 1 : 1;

    // Check if the new quantity exceeds available stock
    if (newQuantityInCart > product.Quantity) {
      return res.status(400).json({ error: `Only ${product.Quantity} units of '${productName}' are available.` });
    }

    // Add to cart or increment the quantity if within stock limits
    if (productInCart) {
      productInCart.Quantity += 1;
    } else {
      tourist.Cart.push({ productName, Quantity: 1 });
    }

    // Save the updated tourist document
    await tourist.save();

    // Send a success response with updated cart data
    res.status(200).json({
      msg: "Product added to cart successfully",
      Cart: tourist.Cart
    });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res.status(500).json({ error: "Failed to add product to cart" });
  }
};


const removeFromCart = async (req, res) => {
  const { touristUsername, productName } = req.body;

  try {
    // Find the tourist by username
    const tourist = await TouristModel.findOne({ Username: touristUsername });
    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    // Find the index of the product in the Cart array
    const cartIndex = tourist.Cart.findIndex(
      (item) => item.productName === productName
    );

    // Check if the product exists in the cart
    if (cartIndex === -1) {
      return res.status(404).json({ error: "Product not found in cart" });
    }

    // Remove the product from the cart
    tourist.Cart.splice(cartIndex, 1);

    // Save the updated tourist document
    await tourist.save();

    // Send a success response with updated cart data
    res.status(200).json({ msg: "Product removed from cart successfully", Cart: tourist.Cart });
  } catch (error) {
    console.error("Error removing product from cart:", error);
    res.status(500).json({ error: "Failed to remove product from cart" });
  }
};

const changeProductQuantityInCart = async (req, res) => {
  const { touristUsername, productName, amount } = req.body;

  try {
    // Find the tourist by username
    const tourist = await TouristModel.findOne({ Username: touristUsername });
    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    // Find the product in the Cart array
    const productInCart = tourist.Cart.find(
      (item) => item.productName === productName
    );

    // Check if the product exists in the cart
    if (!productInCart) {
      return res.status(404).json({ error: "Product not found in cart" });
    }

    // Update the quantity
    if (amount <= 0) {
      return res.status(400).json({ error: "Quantity must be greater than zero" });
    }

    productInCart.Quantity = amount;

    // Save the updated tourist document
    await tourist.save();

    // Send a success response with updated cart data
    res.status(200).json({ msg: "Product quantity updated successfully", Cart: tourist.Cart });
  } catch (error) {
    console.error("Error updating product quantity in cart:", error);
    res.status(500).json({ error: "Failed to update product quantity in cart" });
  }
};

const addPurchasedProducts = async (req, res) => {
  const { touristUsername, products } = req.body; // Expecting an array of products with names and quantities

  try {
    // Find the tourist by username
    const tourist = await TouristModel.findOne({ Username: touristUsername });
    if (!tourist) {
      return res.status(404).json({ msg: 'Tourist not found' });
    }

    // Check if products is an array
    if (!Array.isArray(products)) {
      return res.status(400).json({ msg: 'Products must be provided as an array' });
    }

    // Loop through the products and process each purchase
    for (const { productName, quantity } of products) {
      // Find the product by name
      const product = await ProductModel.findOne({ Name: productName });
      if (!product) {
        return res.status(404).json({ msg: `Product not found: ${productName}` });
      }

      // Check if there's sufficient quantity
      if (product.Quantity < quantity) {
        return res.status(400).json({ msg: `Insufficient quantity for product: ${productName}` });
      }

      // Calculate total price for the purchased quantity
      const totalPriceOfSales = product.Price * quantity;

      // Update TotalPriceOfSales by adding to the existing total
      product.TotalPriceOfSales += totalPriceOfSales;

      // Decrease quantity and increase sales
      product.Quantity -= quantity;  // Decrease quantity by the specified amount
      product.Sales += quantity;     // Increase sales by the specified amount
      await product.save();          // Save the product changes

      // Check if the product is already in the purchasedProducts
      const existingProduct = tourist.purchasedProducts.find(p => p.productName === productName);
      if (existingProduct) {
        // If it exists, update the quantity and total price
        existingProduct.quantity += quantity;
        existingProduct.TotalPriceOfSales += totalPriceOfSales; // Update total price
      } else {
        // If it does not exist, push the product with its quantity and total price
        tourist.purchasedProducts.push({ productName, quantity, TotalPriceOfSales: totalPriceOfSales });
      }
    }

    // Save the updated tourist document
    await tourist.save();

    // Send a response with the updated tourist data
    res.status(200).json({ msg: 'Purchased products added successfully!', purchasedProducts: tourist.purchasedProducts });
  } catch (error) {
    console.error('Error adding purchased products:', error);
    res.status(500).json({ error: error.message });
  }
};

const checkout = async (req, res) => {
  const { touristUsername } = req.body;

  try {
    // Find the tourist by username
    const tourist = await TouristModel.findOne({ Username: touristUsername });
    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    // Initialize total price
    let totalPrice = 0;

    // Iterate over each product in the cart
    for (const cartItem of tourist.Cart) {
      const product = await ProductModel.findOne({ Name: cartItem.productName });

      if (!product) {
        return res.status(404).json({ error: `Product '${cartItem.productName}' not found in ProductModel` });
      }

      // Calculate the price for the current product and add it to the total
      totalPrice += product.Price * cartItem.Quantity;
    }

    // Send the total price as the response
    res.status(200).json({ msg: "Checkout successful", totalPrice });
  } catch (error) {
    console.error("Error during checkout:", error);
    res.status(500).json({ error: "Failed to complete checkout" });
  }
};



const addDeliveryAddress = async (req, res) => {
  const { touristUsername, addresses } = req.body;

  try {
    // Find the tourist by username
    const tourist = await TouristModel.findOne({ Username: touristUsername });
    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    // Ensure addresses is an array
    const addressArray = Array.isArray(addresses) ? addresses : [addresses];

    // Map addresses to the required format and add them to DeliveryAddresses
    addressArray.forEach((address) => {
      tourist.DeliveryAddresses.push({ address });
    });

    // Save the updated tourist document
    await tourist.save();

    // Send a success response with updated delivery addresses
    res.status(200).json({
      msg: "Addresses added to DeliveryAddresses successfully",
      DeliveryAddresses: tourist.DeliveryAddresses
    });
  } catch (error) {
    console.error("Error adding delivery addresses:", error);
    res.status(500).json({ error: "Failed to add delivery addresses" });
  }
};

const viewDeliveryAddresses = async (req, res) => {
  const { touristUsername } = req.query;

  try {
    // Find the tourist by username
    const tourist = await TouristModel.findOne({ Username: touristUsername });
    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    // Send the DeliveryAddresses array as the response
    res.status(200).json({ DeliveryAddresses: tourist.DeliveryAddresses });
  } catch (error) {
    console.error("Error retrieving delivery addresses:", error);
    res.status(500).json({ error: "Failed to retrieve delivery addresses" });
  }
};

const chooseDeliveryAddress = async (req, res) => {
  const { orderNo, Address } = req.body; 

  try {
    const order = await OrderModel.findOne({ orderNumber: orderNo });
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    order.deliveryAddress = Address;
    await order.save();

    res.status(200).json({ msg: "Delivery address updated successfully", order });
  } catch (error) {
    console.error("Error updating delivery address:", error);
    res.status(500).json({ error: "Failed to update delivery address" });
  }
};

// const payOrderWallet = async (req, res) => {
//   const { touristUsername } = req.body;

//   try {
//     // Find the tourist by username
//     const tourist = await TouristModel.findOne({ Username: touristUsername });
//     if (!tourist) {
//       return res.status(404).json({ error: "Tourist not found" });
//     }

//     let totalPrice = 0;
//     const productsPurchased = [];

//     for (const cartItem of tourist.Cart) {
//       const product = await ProductModel.findOne({ Name: cartItem.productName });

//       if (!product) {
//         return res.status(404).json({ error: `Product '${cartItem.productName}' not found in ProductModel` });
//       }

//       // Ensure product.Price and cartItem.Quantity are valid numbers
//       const pricePerUnit = parseFloat(product.Price) || 0;
//       const quantity = parseInt(cartItem.Quantity) || 0;

//       // Calculate the total price for the product
//       const price = pricePerUnit * quantity;

//       if (isNaN(price)) {
//         return res.status(400).json({ error: `Invalid price calculation for product '${product.Name}'.` });
//       }

//       totalPrice += price;

//       // Update product details
//       product.Quantity -= quantity; // Decrease quantity
//       product.Sales += quantity; // Increase sales
//       await product.save();

//       // Prepare product data for the order
//       productsPurchased.push({
//         productName: product.Name,
//         quantity,
//         price: pricePerUnit,
//       });

//       // Update purchasedProducts array in the tourist model
//       const existingProduct = tourist.purchasedProducts.find(p => p.productName === product.Name);
//       if (existingProduct) {
//         existingProduct.quantity += quantity;
//         existingProduct.totalSales += price;
//       } else {
//         tourist.purchasedProducts.push({ productName: product.Name, quantity, totalSales: price });
//       }
//     }

//     // Check if the tourist's wallet has enough funds
//     if (tourist.Wallet < totalPrice) {
//       return res.status(400).json({
//         error: "Insufficient funds in wallet. Please add funds or choose another payment method.",
//       });
//     }

//     // Deduct total price from wallet
//     tourist.Wallet -= totalPrice;

//     // Generate order number
//     const orderCounter = await OrderCounterModel.findOneAndUpdate(
//       { name: 'orderNumber' },
//       { $inc: { count: 1 } },
//       { new: true, upsert: true }
//     );

//     // Create a new order
//     const order = await OrderModel.create({
//       orderNumber: orderCounter.count,
//       touristUsername,
//       productsPurchased,
//       orderDate: new Date(),
//       paymentStatus: "Paid",
//       orderStatus: "Out for Delivery",
//     });

//     // Add order number to the tourist's Orders array
//     tourist.Orders.push({ OrderNumber: order.orderNumber });

//     // Clear the cart
//     tourist.Cart = [];
//     await tourist.save();

//     // Respond with success message
//     res.status(200).json({
//       msg: "Payment successful! Order has been paid using the wallet.",
//       orderDetails: order,
//       remainingWallet: tourist.Wallet,
//     });
//   } catch (error) {
//     console.error("Error during wallet payment:", error);
//     res.status(500).json({ error: "Failed to process payment with wallet." });
//   }
// };

const payOrderWallet = async (req, res) => {
  const { touristUsername } = req.body;

  try {
    const tourist = await TouristModel.findOne({ Username: touristUsername });
    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    let totalPrice = 0;
    const productsPurchased = [];

    for (const cartItem of tourist.Cart) {
      const product = await ProductModel.findOne({ Name: cartItem.productName });
      if (!product) {
        return res.status(404).json({ error: `Product '${cartItem.productName}' not found.` });
      }

      const pricePerUnit = parseFloat(product.Price) || 0;
      const quantity = parseInt(cartItem.Quantity) || 0;
      const price = pricePerUnit * quantity;

      totalPrice += price;

      product.Quantity -= quantity;
      product.Sales += quantity;
      product.TotalPriceOfSales += price;
      await product.save();

      productsPurchased.push({ productName: product.Name, quantity, price: pricePerUnit });

      const existingProduct = tourist.purchasedProducts.find(p => p.productName === product.Name);
      if (existingProduct) {
        existingProduct.quantity += quantity;
        existingProduct.totalSales += price;
      } else {
        tourist.purchasedProducts.push({ productName: product.Name, quantity, totalSales: price });
      }
    }

    if (tourist.Wallet < totalPrice) {
      return res.status(400).json({ error: "Insufficient wallet funds." });
    }

    tourist.Wallet -= totalPrice;

    const orderCounter = await OrderCounterModel.findOneAndUpdate(
      { name: "orderNumber" },
      { $inc: { count: 1 } },
      { new: true, upsert: true }
    );

    const order = await OrderModel.create({
      orderNumber: orderCounter.count,
      touristUsername,
      productsPurchased,
      orderDate: new Date(),
      paymentStatus: "Paid",
      orderStatus: "Out for Delivery",
      TotalPrice:totalPrice
    });

    tourist.Orders.push({ OrderNumber: order.orderNumber });
    tourist.Cart = [];
    await tourist.save();

    // Send Email with Order Details
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: 'malook25062003@gmail.com', // Your email
        pass: 'sxvo feuu woie gpfn',
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: tourist.Email,
      subject: `Order Confirmation #${order.orderNumber}`,
      text: `
        Dear ${tourist.Username},
        
        Thank you for your order! Here are your order details:
        
        Order Number: ${order.orderNumber}
        Order Date: ${order.orderDate.toLocaleDateString()}
        Total Price: ${totalPrice}
        Payment Method: Wallet
        
        Products Purchased:
        ${productsPurchased.map(
          p => `- ${p.productName}: ${p.quantity} x ${p.price} = ${p.quantity * p.price}`
        ).join("\n")}

        Your order is now out for delivery!
        
        Thank you for choosing our service.
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      msg: "Payment successful! Order details emailed.",
      orderDetails: order,
      remainingWallet: tourist.Wallet,
    });
  } catch (error) {
    console.error("Error during wallet payment:", error);
    res.status(500).json({ error: "Failed to process payment with wallet." });
  }
};

const payOrderCash = async (req, res) => {
  const { touristUsername } = req.body;

  try {
    const tourist = await TouristModel.findOne({ Username: touristUsername });
    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    let totalPrice = 0;
    const productsPurchased = [];

    for (const cartItem of tourist.Cart) {
      const product = await ProductModel.findOne({ Name: cartItem.productName });
      if (!product) {
        return res.status(404).json({ error: `Product '${cartItem.productName}' not found.` });
      }

      const pricePerUnit = parseFloat(product.Price) || 0;
      const quantity = parseInt(cartItem.Quantity) || 0;
      const price = pricePerUnit * quantity;

      totalPrice += price;

      product.Quantity -= quantity;
      product.Sales += quantity;
      product.TotalPriceOfSales += price;
      await product.save();

      productsPurchased.push({ productName: product.Name, quantity, price: pricePerUnit });

      const existingProduct = tourist.purchasedProducts.find(p => p.productName === product.Name);
      if (existingProduct) {
        existingProduct.quantity += quantity;
        existingProduct.totalSales += price;
      } else {
        tourist.purchasedProducts.push({ productName: product.Name, quantity, totalSales: price });
      }
    }

    const orderCounter = await OrderCounterModel.findOneAndUpdate(
      { name: "orderNumber" },
      { $inc: { count: 1 } },
      { new: true, upsert: true }
    );

    const order = await OrderModel.create({
      orderNumber: orderCounter.count,
      touristUsername,
      productsPurchased,
      orderDate: new Date(),
      paymentStatus: "Cash On Delivery",
      orderStatus: "Out for Delivery",
    });

    tourist.Orders.push({ OrderNumber: order.orderNumber });
    tourist.Cart = [];
    await tourist.save();

    // Send Email with Order Details
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: 'malook25062003@gmail.com', // Your email
        pass: 'sxvo feuu woie gpfn',
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: tourist.Email,
      subject: `Order Confirmation #${order.orderNumber}`,
      text: `
        Dear ${tourist.Username},
        
        Thank you for your order! Here are your order details:
        
        Order Number: ${order.orderNumber}
        Order Date: ${order.orderDate.toLocaleDateString()}
        Total Price: ${totalPrice}
        Payment Method: Cash On Delivery
        
        Products Purchased:
        ${productsPurchased.map(
          p => `- ${p.productName}: ${p.quantity} x ${p.price} = ${p.quantity * p.price}`
        ).join("\n")}

        Your order is now out for delivery!
        
        Thank you for choosing our service.
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      msg: "Order successful! Order details emailed.",
      orderDetails: order,
    });
  } catch (error) {
    console.error("Error during COD payment:", error);
    res.status(500).json({ error: "Failed to process payment with COD." });
  }
};




const payOrderStripe = async (req, res) => {
  const { touristUsername} = req.body;

  try {

    const paymentMethodId = "pm_card_visa";
    // Find the tourist by username
    const tourist = await TouristModel.findOne({ Username: touristUsername });
    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    let totalPrice = 0;
    const productsPurchased = [];

    // Calculate total price and update product details
    for (const cartItem of tourist.Cart) {
      const product = await ProductModel.findOne({ Name: cartItem.productName });
      if (!product) {
        return res.status(404).json({ error: `Product '${cartItem.productName}' not found.` });
      }

      const pricePerUnit = parseFloat(product.Price) || 0;
      const quantity = parseInt(cartItem.Quantity) || 0;
      const price = pricePerUnit * quantity;

      totalPrice += price;

      product.Quantity -= quantity;
      product.Sales += quantity;
      product.TotalPriceOfSales += price;
      await product.save();

      productsPurchased.push({ productName: product.Name, quantity, price: pricePerUnit });

      const existingProduct = tourist.purchasedProducts.find(p => p.productName === product.Name);
      if (existingProduct) {
        existingProduct.quantity += quantity;
        existingProduct.totalSales += price;
      } else {
        tourist.purchasedProducts.push({ productName: product.Name, quantity, totalSales: price });
      }
    }

    // Create a PaymentIntent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalPrice * 100), // Amount in the smallest currency unit (e.g., piasters for EGP)
      currency: 'usd', // Use EGP currency
      payment_method: paymentMethodId, // Payment method ID from the frontend
      confirm: true, // Automatically confirm the payment
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never', // Disable redirect-based payment methods
      },
    });

    // Check if PaymentIntent was successful
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ error: "Payment failed. Please try again." });
    }

    // Generate order number
    const orderCounter = await OrderCounterModel.findOneAndUpdate(
      { name: "orderNumber" },
      { $inc: { count: 1 } },
      { new: true, upsert: true }
    );

    // Create a new order
    const order = await OrderModel.create({
      orderNumber: orderCounter.count,
      touristUsername,
      productsPurchased,
      orderDate: new Date(),
      paymentStatus: "Paid",
      orderStatus: "Out for Delivery",
    });

    // Add order to tourist's Orders array
    tourist.Orders.push({ OrderNumber: order.orderNumber });
    tourist.Cart = [];
    await tourist.save();

    // Send email with order details
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "malook25062003@gmail.com",
        pass: "sxvo feuu woie gpfn", 
      },
    });

    const mailOptions = {
      from: 'malook25062003@gmail.com',
      to: tourist.Email,
      subject: `Order Confirmation #${order.orderNumber}`,
      text: `
        Dear ${tourist.Username},

        Thank you for your order! Here are your order details:

        Order Number: ${order.orderNumber}
        Order Date: ${order.orderDate.toLocaleDateString()}
        Total Price: ${totalPrice.toFixed(2)} EGP
        Payment Method: Credit Card (via Stripe)

        Products Purchased:
        ${productsPurchased.map(
          p => `- ${p.productName}: ${p.quantity} x ${p.price} = ${(p.quantity * p.price).toFixed(2)}`
        ).join("\n")}

        Your order is now out for delivery!

        Thank you for choosing our service.
      `,
    };

    await transporter.sendMail(mailOptions);

    // Respond with success
    res.status(200).json({
      msg: "Order successful! Payment completed via Stripe. Order details emailed.",
      orderDetails: order,
    });
  } catch (error) {
    console.error("Error during Stripe payment:", error);
    res.status(500).json({ error: "Failed to process payment with Stripe." });
  }
};



// const viewOrderDetails = async (req, res) => {
//   const { orderNumber } = req.query;

//   try {
//     if (!orderNumber) {
//       return res.status(400).json({ error: "Order number is required." });
//     }

    

//     // Fetch the specific order by orderNumber and username
//     const order = await OrderModel.findOne({ orderNumber});
//     if (!order) {
//       return res.status(404).json({ error: `Order with number ${orderNumber} not found.` });
//     }

//     // Respond with the specific order details
//     res.status(200).json({
//       msg: "Order details retrieved successfully.",
//       orderDetails: order,
//     });
//   } catch (error) {
//     console.error("Error retrieving order details:", error);
//     res.status(500).json({ error: "Failed to retrieve order details." });
//   }
// };

const viewOrderDetails = async (req, res) => {
  const { orderNumber } = req.query;

  try {
    if (!orderNumber) {
      return res.status(400).json({ error: "Order number is required." });
    }

    // Fetch the specific order by orderNumber
    const order = await OrderModel.findOne({ orderNumber });
    if (!order) {
      return res.status(404).json({ error: `Order with number ${orderNumber} not found.` });
    }

    // Fetch product details for each product in the order
    const productDetailsPromises = order.productsPurchased.map(async (purchasedProduct) => {
      const product = await ProductModel.findOne({ Name: purchasedProduct.productName });
      return {
        ...purchasedProduct._doc, // Include the purchased product details
        productDetails: product || null, // Add the product details (null if not found)
      };
    });

    // Resolve all promises to get the complete product details
    const detailedProducts = await Promise.all(productDetailsPromises);

    // Respond with the specific order details and enriched product details
    res.status(200).json({
      msg: "Order details retrieved successfully.",
      orderDetails: {
        ...order._doc,
        productsPurchased: detailedProducts, // Include enriched product details
      },
    });
  } catch (error) {
    console.error("Error retrieving order details:", error);
    res.status(500).json({ error: "Failed to retrieve order details." });
  }
};


const cancelOrder = async (req, res) => {
  const { touristUsername, orderNumber } = req.body;

  try {
    // Validate input
    if (!orderNumber) {
      return res.status(400).json({ error: "Order number is required." });
    }

    // Find the tourist by username
    const tourist = await TouristModel.findOne({ Username: touristUsername });
    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found." });
    }

    // Find the specific order
    const order = await OrderModel.findOne({ orderNumber, touristUsername });
    if (!order) {
      return res.status(404).json({ error: `Order with number ${orderNumber} not found for user ${touristUsername}.` });
    }

    // Check if the order has already been delivered
    if (order.orderStatus === "Delivered") {
      return res.status(400).json({
        error: "Delivered orders cannot be canceled.",
      });
    }

    let totalRefund = 0;

    // Revert product details in all cases
    for (const item of order.productsPurchased) {
      const product = await ProductModel.findOne({ Name: item.productName });

      if (product) {
        // Revert product quantity and sales
        product.Quantity += item.quantity; // Increase product quantity
        product.Sales -= item.quantity; // Decrease sales
        product.TotalPriceOfSales -= item.quantity * item.price; // Decrease total sales price
        await product.save();

        // Calculate total refund for non-Cash On Delivery
        if (order.paymentStatus !== "Cash On Delivery") {
          totalRefund += item.quantity * item.price;
        }
      }
    }

    // If payment was not "Cash On Delivery", refund to wallet
    if (order.paymentStatus !== "Cash On Delivery") {
      tourist.Wallet += totalRefund;
    }

    // Remove the order from the Tourist's Orders array
    tourist.Orders = tourist.Orders.filter((o) => parseInt(o.OrderNumber) !== orderNumber);

    // Save the updated tourist details
    await tourist.save();

    // Remove the order from the OrderModel
    await OrderModel.deleteOne({ orderNumber, touristUsername });

    res.status(200).json({
      msg: `Order ${orderNumber} has been successfully cancelled and removed. ${
        order.paymentStatus !== "Cash On Delivery"
          ? "Refund has been added to the wallet."
          : ""
      }`,
    });
  } catch (error) {
    console.error("Error during order cancellation:", error);
    res.status(500).json({ error: "Failed to cancel order." });
  }
};

const markOrdersAsDelivered = async (req, res) => {
  try {

    const orders = await OrderModel.find({});

    const now = new Date();
    let updatedOrders = 0;

    for (const order of orders) {
      const orderDate = new Date(order.orderDate);

      // Check if the order date is more than 2 days ago
      const daysPassed = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24)); // Calculate days difference
      if (daysPassed > 2 && order.orderStatus !== "Delivered") {
        // Update the order status to Delivered
        order.orderStatus = "Delivered";
        await order.save();
        updatedOrders++;
      }
    }

    res.status(200).json({
      msg: `Orders updated successfully. ${updatedOrders} orders marked as Delivered.`,
    });
  } catch (error) {
    console.error("Error marking orders as delivered:", error);
    res.status(500).json({ error: "Failed to update orders." });
  }
};

const viewAllOrders = async (req, res) => {
  const { touristUsername } = req.query;

  try {
    // Find the tourist by username
    const tourist = await TouristModel.findOne({ Username: touristUsername });

    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    // Retrieve orders based on the OrderNumbers in the tourist's Orders array
    const orderNumbers = tourist.Orders.map(order => order.OrderNumber);
    const orders = await OrderModel.find({ orderNumber: { $in: orderNumbers } });

    // Separate active and past orders
    const currentOrders = orders.filter(order => 
      order.orderStatus !== "Delivered" && order.orderStatus !== "Cancelled"
    );
    const pastOrders = orders.filter(order => 
      order.orderStatus === "Delivered" || order.orderStatus === "Cancelled"
    );

    // Respond with current and past orders
    res.status(200).json({
      msg: "Orders retrieved successfully.",
      currentOrders,
      pastOrders,
    });
  } catch (error) {
    console.error("Error retrieving orders:", error);
    res.status(500).json({ error: "Failed to retrieve orders." });
  }
};

const getTourGuideComments = async (req, res) => {
  const { tourGuideUsername } = req.query; // Retrieve the tour guide username from the query parameters

  if (!tourGuideUsername) {
    return res.status(400).json({ msg: "Tour guide username is required." });
  }

  try {
    // Find the tour guide by username
    const tourGuide = await TourGuideModel.findOne({ Username: tourGuideUsername });

    if (!tourGuide) {
      return res.status(404).json({ msg: "Tour guide not found." });
    }

    // Return the comments
    res.status(200).json({ comments: tourGuide.Comments });
  } catch (error) {
    console.error("Error fetching comments for tour guide:", error);
    res.status(500).json({ msg: "An error occurred while fetching comments.", error: error.message });
  }
};

const sendUpcomingEventNotifications = async () => {
  const today = new Date();
  const tomorrow = new Date();
  const todayStart = new Date(today.setHours(0, 0, 0, 0));
  const tomorrowEnd = new Date(tomorrow.setDate(tomorrow.getDate() + 1));
  tomorrowEnd.setHours(23, 59, 59, 999);

  try {
    const tourists = await TouristModel.find();

    for (const tourist of tourists) {
      const upcomingEventNames = [];

      // Check for activities
      for (const activity of tourist.BookedActivities || []) {
        const event = await ActivityModel.findOne({ Name: activity.activityName });
        if (event && event.Date >= todayStart && event.Date <= tomorrowEnd) {
          upcomingEventNames.push(event.Name);
        }
      }

      // Check for itineraries
      for (const itinerary of tourist.BookedItineraries || []) {
        const event = await ItineraryModel.findOne({ Title: itinerary.ItineraryName });
        if (event && event.Date >= todayStart && event.Date <= tomorrowEnd) {
          upcomingEventNames.push(event.Title);
        }
      }

      // Check for museums
      for (const museum of tourist.BookedMuseums || []) {
        const event = await MuseumModel.findOne({ name: museum.MuseumName });
        if (event && event.dateOfEvent >= todayStart && event.dateOfEvent <= tomorrowEnd) {
          upcomingEventNames.push(event.name);
        }
      }

      // Check for historical places
      for (const place of tourist.BookedHistPlaces || []) {
        const event = await HistoricalPlacesModel.findOne({ name: place.HistPlaceName });
        if (event && event.dateOfEvent >= todayStart && event.dateOfEvent <= tomorrowEnd) {
          upcomingEventNames.push(event.name);
        }
      }

      // Send notifications if there are upcoming events
      if (upcomingEventNames.length > 0) {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "malook25062003@gmail.com",
            pass: "sxvo feuu woie gpfn", // Ensure this is correct
          },
        });

        const eventDetails = upcomingEventNames
          .map(eventName => `- ${eventName}`)
          .join("\n");

        const mailOptions = {
          from: "malook25062003@gmail.com",
          to: tourist.Email,
          subject: "Upcoming Events Reminder 🎉",
          text: `
            Dear ${tourist.Username},

            Here are your upcoming events for tomorrow:

            ${eventDetails}

            Don’t forget to prepare and enjoy your experience!

            Best wishes,
            The Beyond Borders Team
          `,
        };

        try {
          // Send email reminder
          await transporter.sendMail(mailOptions);
          console.log(`Reminder sent to ${tourist.Email}`);

          // Add individual event names to the tourist's Notifications array
          for (const eventName of upcomingEventNames) {
            tourist.Notifications.push({
              NotificationText: `You have an upcoming event: ${eventName}`,
              Read: false,
            });
          }

          // Save the updated tourist document
          await tourist.save();
          console.log(`Notifications added to ${tourist.Username}`);
        } catch (emailError) {
          console.error(`Failed to send email to ${tourist.Email}:`, emailError);
        }
      }
    }
  } catch (error) {
    console.error("Error sending event reminders:", error);
  }
};



const addNotificationSubscriberHP = async (req, res) => {
  const { username, historicalPlaceName } = req.body;

  if (!username || !historicalPlaceName) {
      return res.status(400).json({ error: 'Username and historical place name are required.' });
  }

  try {
      // Find the historical place by name
      const historicalPlace = await HistoricalPlacesModel.findOne({ name: historicalPlaceName });

      if (!historicalPlace) {
          return res.status(404).json({ error: 'Historical place not found.' });
      }

      // Check if the username is already in the array
      const isAlreadySubscribed = historicalPlace.SendNotificationTo.some(
          (subscriber) => subscriber.username === username
      );

      if (isAlreadySubscribed) {
          return res.status(400).json({ error: 'User is already subscribed for notifications.' });
      }

      // Add the username to the SendNotificationTo array
      historicalPlace.SendNotificationTo.push({ username });
      await historicalPlace.save();

      res.status(200).json({
          message: `User ${username} has been added to the notification list for ${historicalPlaceName}.`,
          updatedPlace: historicalPlace,
      });
  } catch (error) {
      res.status(500).json({ error: 'An error occurred while updating the notification list.', details: error.message });
  }
};

const addNotificationSubscriberMuseum = async (req, res) => {
  const { username, museumName } = req.body;

  if (!username || !museumName) {
    return res.status(400).json({
      error: 'Username and museum name are required.',
    });
  }

  try {
    // Find the museum by name
    const museum = await MuseumModel.findOne({ name: museumName });

    if (!museum) {
      return res.status(404).json({ error: 'Museum not found.' });
    }

    // Check if the username is already in the array
    const isAlreadySubscribed = museum.SendNotificationTo.some(
      (subscriber) => subscriber.username === username
    );

    if (isAlreadySubscribed) {
      return res
        .status(400)
        .json({ error: 'User is already subscribed for notifications.' });
    }

    // Add the username to the SendNotificationTo array
    museum.SendNotificationTo.push({ username });
    await museum.save();

    res.status(200).json({
      message: `User ${username} has been added to the notification list for ${museumName}.`,
      updatedMuseum: museum,
    });
  } catch (error) {
    res.status(500).json({
      error: 'An error occurred while updating the notification list.',
      details: error.message,
    });
  }
};

const addNotificationSubscriberActivity = async (req, res) => {
  const { username, activityName } = req.body;

  if (!username || !activityName) {
    return res.status(400).json({
      error: 'Username and activity name are required.',
    });
  }

  try {
    // Find the activity by name
    let activity = await ActivityModel.findOne({ Name: activityName });

    if (!activity) {
      return res.status(404).json({ error: 'Activity not found.' });
    }

    // Ensure `SendNotificationTo` exists
    if (!activity.SendNotificationTo) {
      activity.SendNotificationTo = [];
    }

    // Check if the username is already in the array
    const isAlreadySubscribed = activity.SendNotificationTo.some(
      (subscriber) => subscriber.username === username
    );

    if (isAlreadySubscribed) {
      return res
        .status(400)
        .json({ error: 'User is already subscribed for notifications.' });
    }

    // Add the username to the SendNotificationTo array
    activity.SendNotificationTo.push({ username });
    await activity.save();

    res.status(200).json({
      message: `User ${username} has been added to the notification list for ${activityName}.`,
      updatedActivity: activity,
    });
  } catch (error) {
    res.status(500).json({
      error: 'An error occurred while updating the notification list.',
      details: error.message,
    });
  }
};

const addNotificationSubscriberItinerary = async (req, res) => {
  const { username, itineraryTitle } = req.body;

  if (!username || !itineraryTitle) {
    return res.status(400).json({
      error: 'Username and itinerary title are required.',
    });
  }

  try {
    // Find the itinerary by title
    let itinerary = await ItineraryModel.findOne({ Title: itineraryTitle });

    if (!itinerary) {
      return res.status(404).json({ error: 'Itinerary not found.' });
    }

    // Ensure `SendNotificationTo` exists
    if (!itinerary.SendNotificationTo) {
      itinerary.SendNotificationTo = [];
    }

    // Check if the username is already in the array
    const isAlreadySubscribed = itinerary.SendNotificationTo.some(
      (subscriber) => subscriber.username === username
    );

    if (isAlreadySubscribed) {
      return res
        .status(400)
        .json({ error: 'User is already subscribed for notifications.' });
    }

    // Add the username to the SendNotificationTo array
    itinerary.SendNotificationTo.push({ username });
    await itinerary.save();

    res.status(200).json({
      message: `User ${username} has been added to the notification list for ${itineraryTitle}.`,
      updatedItinerary: itinerary,
    });
  } catch (error) {
    res.status(500).json({
      error: 'An error occurred while updating the notification list.',
      details: error.message,
    });
  }
};

const allNotificationsTouristRead = async (req, res) => {
  const { username } = req.body; // Extract username from the request body
  try {
    if (!username) {
      return res.status(400).json({ error: "Username is required." });
    }

    const updatedTourist = await TouristModel.findOneAndUpdate(
      { Username: username }, // Find the tourist by username
      { $set: { "Notifications.$[].Read": true } }, // Update all notifications to `Read: true`
      { new: true } // Return the updated document
    );

    if (!updatedTourist) {
      return res.status(404).json({ error: "Tourist not found." });
    }

    res.status(200).json({
      message: "All notifications marked as read successfully.",
      tourist: updatedTourist,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const areAllTouristNotificationsRead = async (req, res) => {
  const { username } = req.query; // Extract username from query

  try {
    if (!username) {
      return res.status(400).json({ error: "Username is required." });
    }

    // Find the tourist by username and select the Notifications field
    const tourist = await TouristModel.findOne({ Username: username }, "Notifications");

    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found." });
    }

    // Check if all notifications are marked as `Read: true`
    const allRead = tourist.Notifications.every(notification => notification.Read);

    res.status(200).json({ allRead }); // Return true or false
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTouristNotifications = async (req, res) => {
  const { username } = req.query; // Extract username from query parameters

  try {
    if (!username) {
      return res.status(400).json({ error: "Username is required." });
    }

    // Find the tourist and retrieve the Notifications field
    const tourist = await TouristModel.findOne(
      { Username: username },
      "Notifications" // Only select the Notifications field
    );

    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found." });
    }

    // Return all notifications
    res.status(200).json({ notifications: tourist.Notifications });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTouristCartDetails = async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ msg: "Tourist username is required." });
  }

  try {
    // Fetch the tourist by username
    const tourist = await TouristModel.findOne({ Username: username });

    if (!tourist) {
      return res.status(404).json({ msg: "Tourist not found." });
    }

    const cartDetails = await Promise.all(
      tourist.Cart.map(async (cartItem) => {
        const product = await ProductModel.findOne({ Name: cartItem.productName });
        if (product) {
          return {
            productName: cartItem.productName,
            quantity: cartItem.Quantity,
            productDetails: {
              Name: product.Name,
              Description: product.Description,
              Price: product.Price,
              Picture: product.Picture,
              Seller: product.Seller,
              Ratings: product.Ratings,
              RatingCount: product.RatingCount,
            },
          };
        }
        return null; // Skip if product is not found
      })
    );

    // Filter out null values (for products not found)
    const filteredCartDetails = cartDetails.filter((item) => item !== null);

    res.status(200).json(filteredCartDetails);
  } catch (error) {
    console.error("Error fetching cart details:", error);
    res.status(500).json({ msg: "An error occurred while fetching the cart details.", error: error.message });
  }
};



module.exports = {createTourist, getTourist, updateTourist, searchProductTourist, filterActivities, filterProductByPriceTourist, ActivityRating, sortProductsDescendingTourist, sortProductsAscendingTourist, ViewAllUpcomingActivities, ViewAllUpcomingMuseumEventsTourist, getMuseumsByTagTourist, getHistoricalPlacesByTagTourist, ViewAllUpcomingHistoricalPlacesEventsTourist,viewProductsTourist, sortActivitiesPriceAscendingTourist, sortActivitiesPriceDescendingTourist, sortActivitiesRatingAscendingTourist, sortActivitiesRatingDescendingTourist, loginTourist, ViewAllUpcomingItinerariesTourist, sortItinerariesPriceAscendingTourist, sortItinerariesPriceDescendingTourist, filterItinerariesTourist, ActivitiesSearchAll, ItinerarySearchAll, MuseumSearchAll, HistoricalPlacesSearchAll, ProductRating, createComplaint, getComplaintsByTouristUsername,ChooseActivitiesByCategoryTourist,bookActivity,bookItinerary,bookMuseum,bookHistoricalPlace, ratePurchasedProduct, addPurchasedProducts, reviewPurchasedProduct, addCompletedItinerary, rateTourGuide, commentOnTourGuide, rateCompletedItinerary, commentOnItinerary, addCompletedActivities, addCompletedMuseumEvents, addCompletedHPEvents, rateCompletedActivity, rateCompletedMuseum, rateCompletedHP, commentOnActivity, commentOnMuseum, commentOnHP,deleteBookedActivity,deleteBookedItinerary,deleteBookedMuseum,deleteBookedHP,payActivity,updateWallet,updatepoints,payItinerary,payMuseum,payHP,redeemPoints, convertEgp, fetchFlights,viewBookedItineraries, requestDeleteAccountTourist,convertCurr,getActivityDetails,getHistoricalPlaceDetails,getMuseumDetails,GetCopyLink, bookFlight
  ,fetchHotelsByCity, fetchHotels, bookHotel,bookTransportation,addPreferences, viewMyCompletedActivities, viewMyCompletedItineraries, viewMyCompletedMuseums, viewMyCompletedHistoricalPlaces,viewMyBookedActivities,viewMyBookedItineraries,viewMyBookedMuseums,viewMyBookedHistoricalPlaces,viewTourGuidesCompleted,viewAllTransportation, getItineraryDetails, viewPreferenceTags,viewPurchasedProducts,viewBookedActivities,viewMyBookedTransportation,addBookmark
, payActivityByCard, payItineraryByCard, payMuseumByCard, payHPByCard, sendOtp, loginTouristOTP,viewBookmarks, addToWishList, viewMyWishlist, removeFromWishlist, addToCartFromWishlist, addToCart, removeFromCart, changeProductQuantityInCart, checkout, addDeliveryAddress, viewDeliveryAddresses,chooseDeliveryAddress,payOrderWallet,payOrderCash,viewOrderDetails,cancelOrder,cancelOrder,markOrdersAsDelivered,viewAllOrders,sendUpcomingEventNotifications,payOrderStripe
,payItineraryStripe,payActivityStripe,payMuseumStripe,payHPStripe, fetchCityCode, checkIfInWishlist, getTourGuideComments,addNotificationSubscriberHP,addNotificationSubscriberMuseum,addNotificationSubscriberActivity,addNotificationSubscriberItinerary,allNotificationsTouristRead,areAllTouristNotificationsRead,getTouristNotifications, getTouristCartDetails};
