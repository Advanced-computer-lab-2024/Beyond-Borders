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



const ItineraryModel = require('../Models/Itinerary.js');
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
              completedItineraries: [],
              Points: 0,
              BadgeLevelOfPoints: 1
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

      
      const searchProductTourist = async (req, res) => {
         const {ProductName} = req.body;
         try {
             const fetchedProduct = await NewProduct.findOne({Name: ProductName}); //Fetch all categories
             res.status(200).json(fetchedProduct);
         } catch (error) {
            res.status(200).json({ msg: "There is no product with this name!" });
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
          return activity.Date >= currentDate; // Include only upcoming activities
        });
    
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

    const ViewAllUpcomingItinerariesTourist = async (req, res) => {
      try {
        // Get today's date and set the time to midnight
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); 
        const itineraries = await ItineraryModel.find(); 
        const upcomingItineraries = itineraries.filter(itineraries => {
          return itineraries.Date >= currentDate; // Include only upcoming activities
        });
    
        // Return the upcoming activities as a JSON response
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
  
          // Find museums with any of the specified tags
          const museums = await MuseumModel.find({ HistoricalTags: { $in: tags } });
  
          // Check if any museums were found
          if (museums.length > 0) {
              res.status(200).json(museums);
          } else {
              res.status(404).json({ error: "No museums found with the specified tags." });
          }
      } catch (error) {
          res.status(400).json({ error: error.message });
      }
  };

  const getHistoricalPlacesByTagTourist = async (req, res) => {
    try {
        // Extract the tags array from the request body
        const { tags } = req.body; // Expecting an array of tags

        // Find museums with any of the specified tags
        const historicalPlaces = await HistoricalPlacesModel.find({ Tags: { $in: tags } });

        // Check if any museums were found
        if (historicalPlaces.length > 0) {
            res.status(200).json(historicalPlaces);
        } else {
            res.status(404).json({ error: "No Historical Places found with the specified tags." });
        }
    } catch (error) {
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

const sortActivitiesPriceDescendingTourist = async (req, res) => {
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

const sortActivitiesRatingAscendingTourist = async (req, res) => {
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

const sortActivitiesRatingDescendingTourist = async (req, res) => {
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

const sortItinerariesPriceAscendingTourist = async (req, res) => {
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

const sortItinerariesPriceDescendingTourist = async (req, res) => {
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


      const ActivitiesSearchAll = async (req, res) => {
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
    };
    const ItinerarySearchAll = async (req, res) => {
      const { searchString } = req.body; // Extract the search string from the request body
      const query = {}; // Initialize an empty query object
  
      // Create a case-insensitive regex if a search string is provided
      if (searchString) {
          const regex = new RegExp(searchString, 'i'); // 'i' for case-insensitive matching
  
          // Construct the query to search across the Name, Category, and Tags fields
          query.$or = [
              { Title: regex },
              { Tags: { $in: [searchString] } } // For Tags, match any tag that equals the search string
          ];
      }
  
      try {
          const fetchedItineraries = await ItineraryModel.find(query); // Fetch activities based on the constructed query
          if (fetchedItineraries.length === 0) {
              return res.status(404).json({ msg: "No itineraries found for the given criteria!" });
          }
          res.status(200).json(fetchedItineraries); // Respond with the fetched activities
      } catch (error) {
          console.error('Error fetching itineraries:', error);
          res.status(500).json({ msg: "An error occurred while fetching itineraries." });
      }
  };

  const MuseumSearchAll = async (req, res) => {
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
};

const HistoricalPlacesSearchAll = async (req, res) => {
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

const createComplaint = async (req, res) => {
  const { Title, Body, TouristUsername } = req.body;

  try {
      // Create a new complaint object
      const newComplaint = new ComplaintsModel({
          Title: Title,
          Body: Body,
          Date: new Date(),
          Status: 'pending',
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

   
    tourist.BookedActivities.push({
      activityName: activity.Name,
      confirmed: true 
    });

    
    await tourist.save();

    
    res.status(201).json({ msg: 'Activity booked successfully!', activityName: activity.Name, totalCost: activity.Price });
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

    tourist.BookedItineraries.push({
      ItineraryName: itinerary.Title,  
      booked: true 
    });

    
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

    tourist.BookedMuseums.push({
      MuseumName: museum.name,  
      booked: true 
    });

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

    tourist.BookedHistPlaces.push({
      HistPlaceName: historicalPlace.name,  
      booked: true 
    });

    await tourist.save();

    res.status(201).json({ msg: 'Historical Place booked successfully!', historicalPlaceName: historicalPlace.name, ticketPrice });
  } catch (error) {
    console.error('Error booking historical place:', error);
    res.status(500).json({ error: error.message });
  }
};

const addPurchasedProducts = async (req, res) => {
  const { touristUsername, productNames } = req.body; // Expecting an array of product names

  try {
    // Find the tourist by username
    const tourist = await TouristModel.findOne({ Username: touristUsername });
    if (!tourist) {
      return res.status(404).json({ msg: 'Tourist not found' });
    }

    // Check if productNames is an array
    if (!Array.isArray(productNames)) {
      return res.status(400).json({ msg: 'Product names must be provided as an array' });
    }

    // Loop through the product names and add them to purchasedProducts
    productNames.forEach(productName => {
      // Check if the product is already in the purchasedProducts
      const existingProduct = tourist.purchasedProducts.find(p => p.Name === productName);
      if (!existingProduct) {
        tourist.purchasedProducts.push({ productName }); // Add product name without rating
      }
    });

    // Save the updated tourist document
    await tourist.save();

    // Send a response with the updated tourist data
    res.status(200).json({ msg: 'Purchased products added successfully!', purchasedProducts: tourist.purchasedProducts });
  } catch (error) {
    console.error('Error adding purchased products:', error);
    res.status(500).json({ error: error.message });
  }
};


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
  const { touristUsername, itineraryName } = req.body;

  try {
    // Find the tourist by username
    const tourist = await TouristModel.findOne({ Username: touristUsername });
    if (!tourist) {
      return res.status(404).json({ msg: 'Tourist not found' });
    }

    // Find the booked itinerary
    const bookedItinerary = tourist.BookedItineraries.find(itinerary => itinerary.ItineraryName === itineraryName);
    if (!bookedItinerary) {
      return res.status(400).json({ msg: 'Itinerary not booked by the tourist' });
    }

    // Fetch the itinerary from the ItineraryModel to check the date
    const itinerary = await ItineraryModel.findOne({ Title: itineraryName }); // Assuming `name` is the key for the itinerary
    if (!itinerary) {
      return res.status(404).json({ msg: 'Itinerary not found' });
    }

    // Check if the date has passed
    const currentDate = new Date();
    if (itinerary.Date > currentDate) { 
      return res.status(400).json({ msg: 'The itinerary date has not passed yet' });
    }

    // Add the completed itinerary to the completedItineraries array
    tourist.completedItineraries.push({
      ItineraryName: itineraryName
    });

    // Save the updated tourist document
    await tourist.save();

    // Send a response with the updated tourist data
    res.status(200).json({ msg: 'Itinerary marked as completed successfully!', completedItineraries: tourist.completedItineraries });
  } catch (error) {
    console.error('Error adding completed itinerary:', error);
    res.status(500).json({ error: error.message });
  }
};

const addCompletedActivities = async (req, res) => {
  const { touristUsername, activityName } = req.body;

  try {
    // Find the tourist by username
    const tourist = await TouristModel.findOne({ Username: touristUsername });
    if (!tourist) {
      return res.status(404).json({ msg: 'Tourist not found' });
    }

    const bookedActivity = tourist.BookedActivities.find(activity => activity.activityName === activityName);
    if (!bookedActivity) {
      return res.status(400).json({ msg: 'Activity not booked by the tourist' });
    }

    // Fetch the activity to check the date
    const activity = await ActivityModel.findOne({ Name: activityName });
    if (!activity) {
      return res.status(404).json({ msg: 'Activity not found' });
    }

    // Check if the activity date is in the past
    const currentDate = new Date();
    if (activity.Date > currentDate) {
      return res.status(400).json({ msg: 'The activity date has not passed yet' });
    }

    // Add the completed activity to the completedActivities array
    tourist.completedActivities.push({ ActivityName: activityName });

    // Save the updated tourist document
    await tourist.save();

    // Send a response with the updated tourist data
    res.status(200).json({
      msg: 'Activity marked as completed successfully!',
      completedActivities: tourist.completedActivities
    });
  } catch (error) {
    console.error('Error adding completed activity:', error);
    res.status(500).json({ error: error.message });
  }
};

const addCompletedMuseumEvents = async (req, res) => {
  const { touristUsername, museumName } = req.body;

  try {
    // Find the tourist by username
    const tourist = await TouristModel.findOne({ Username: touristUsername });
    if (!tourist) {
      return res.status(404).json({ msg: 'Tourist not found' });
    }

    // Check if the museum is in the bookedMuseums array
    const bookedMuseum = tourist.BookedMuseums.find(museum => museum.MuseumName === museumName);
    if (!bookedMuseum) {
      return res.status(400).json({ msg: 'Museum event not booked by the tourist' });
    }

    // Fetch the museum event to check the date
    const museumEvent = await MuseumModel.findOne({ name: museumName }); // Use the correct model name
    if (!museumEvent) {
      return res.status(404).json({ msg: 'Museum event not found' });
    }

    // Check if the museum event date is in the past
    const currentDate = new Date();
    if (museumEvent.dateOfEvent > currentDate) { // Correctly access the dateOfEvent property
      return res.status(400).json({ msg: 'The museum event date has not passed yet' });
    }

    // Add the completed museum event to the completedMuseumEvents array
    tourist.completedMuseumEvents.push({ MuseumName: museumName });

    // Save the updated tourist document
    await tourist.save();

    // Send a response with the updated tourist data
    res.status(200).json({
      msg: 'Museum event marked as completed successfully!',
      completedMuseumEvents: tourist.completedMuseumEvents
    });
  } catch (error) {
    console.error('Error adding completed museum event:', error);
    res.status(500).json({ error: error.message });
  }
};

const addCompletedHPEvents = async (req, res) => {
  const { touristUsername, hpName } = req.body;

  try {
    // Find the tourist by username
    const tourist = await TouristModel.findOne({ Username: touristUsername });
    if (!tourist) {
      return res.status(404).json({ msg: 'Tourist not found' });
    }

    // Check if the historical place is in the bookedHistPlaces array
    const bookedHP = tourist.BookedHistPlaces.find(hp => hp.HistPlaceName === hpName);
    if (!bookedHP) {
      return res.status(400).json({ msg: 'Historical Place event not booked by the tourist' });
    }

    // Fetch the historical place event to check the date
    const hpEvent = await HistoricalPlacesModel.findOne({ name: hpName }); // Correct model name
    if (!hpEvent) {
      return res.status(404).json({ msg: 'Historical Place event not found' });
    }

    // Check if the historical place event date is in the past
    const currentDate = new Date();
    if (hpEvent.dateOfEvent > currentDate) { // Correctly access the dateOfEvent property
      return res.status(400).json({ msg: 'The Historical Place event date has not passed yet' });
    }

    // Add the completed historical place event to the completedHistoricalPlaceEvent array
    tourist.completedHistoricalPlaceEvent.push({ HistoricalPlaceName: hpName });

    // Save the updated tourist document
    await tourist.save();

    // Send a response with the updated tourist data
    res.status(200).json({
      msg: 'Historical Place event marked as completed successfully!',
      completedHistoricalPlaceEvent: tourist.completedHistoricalPlaceEvent // Correctly reference the completed event
    });
  } catch (error) {
    console.error('Error adding completed Historical Place event:', error);
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

    // Save the updated tourist document
    await tourist.save();

    // Respond with success
    res.status(200).json({ msg: 'Activity canceled successfully.' });
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

    // Save the updated tourist document
    await tourist.save();

    // Respond with success
    res.status(200).json({ msg: 'itinerary canceled successfully.' });
  } catch (error) {
    console.error('Error itinerary activity:', error);
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
    const bookedActivity = tourist.BookedActivities.find(
      (activity) => activity.activityName === activityName
    );

    if (!bookedActivity) {
      return res.status(400).json({ msg: 'Activity not found in booked activities. Please book the activity first.' });
    }
    // Calculate ticket price
    const ticketPrice = activity.Price;

    // Check if the tourist has enough funds in the wallet
    if (tourist.Wallet < ticketPrice) {
      return res.status(400).json({ msg: 'Insufficient funds in wallet.' });
    }

    // Deduct the ticket price from the tourist's wallet
    tourist.Wallet -= ticketPrice;
    if(tourist.BadgeLevelOfPoints ===1){
      tourist.Points+= 0.5* ticketPrice;
      if(tourist.Points>100000){
        tourist.BadgeLevelOfPoints=2;}
      else if(tourist.Points>500000){
        tourist.BadgeLevelOfPoints=3;
      }
    }
    else if(tourist.BadgeLevelOfPoints ===2){
      tourist.Points+= ticketPrice;
       if(tourist.Points>500000){
        tourist.BadgeLevelOfPoints=3;
      }

    }
    else if(tourist.BadgeLevelOfPoints ===3){
      tourist.Points+= 1.5*ticketPrice;
    }
    
    // Save the updated tourist information
    await tourist.save();

    // Respond with success and remaining wallet balance
    res.status(200).json({ msg: 'Payment successful!', activityName: activity.Name, remainingWallet: tourist.Wallet ,BadgeLevelOfPoints: tourist.BadgeLevelOfPoints, Points:tourist.Points});
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
    tourist.Wallet = (tourist.Wallet || 0) + amount;

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
    // Find the activity by name
    const itinerary = await ItineraryModel.findOne({ Title: ItineraryName });
    if (!itinerary) {
      return res.status(404).json({ msg: 'itinerary not found' });
    }
     
    
    // Find the tourist by username
    const tourist = await TouristModel.findOne({ Username: touristUsername });
    if (!tourist) {
      return res.status(404).json({ msg: 'Tourist not found' });
    }
    const BookedItinerary = tourist.BookedItineraries.find(
      (itinerary) => itinerary.ItineraryName === ItineraryName
    );

    if (!BookedItinerary) {
      return res.status(400).json({ msg: 'itinerary not found in booked activities. Please book the activity first.' });
    }
    // Calculate ticket price
    const ticketPrice = itinerary.Price;

    // Check if the tourist has enough funds in the wallet
    if (tourist.Wallet < ticketPrice) {
      return res.status(400).json({ msg: 'Insufficient funds in wallet.' });
    }

    // Deduct the ticket price from the tourist's wallet
    tourist.Wallet -= ticketPrice;
    if(tourist.BadgeLevelOfPoints ===1){
      tourist.Points+= 0.5* ticketPrice;
      if(tourist.Points>100000){
        tourist.BadgeLevelOfPoints=2;}
      else if(tourist.Points>500000){
        tourist.BadgeLevelOfPoints=3;
      }
    }
    else if(tourist.BadgeLevelOfPoints ===2){
      tourist.Points+= ticketPrice;
       if(tourist.Points>500000){
        tourist.BadgeLevelOfPoints=3;
      }

    }
    else if(tourist.BadgeLevelOfPoints ===3){
      tourist.Points+= 1.5*ticketPrice;
    }
    
    // Save the updated tourist information
    await tourist.save();

    // Respond with success and remaining wallet balance
    res.status(200).json({ msg: 'Payment successful!', ItineraryName: itinerary.Title, remainingWallet: tourist.Wallet ,BadgeLevelOfPoints: tourist.BadgeLevelOfPoints, Points:tourist.Points});
  } catch (error) {
    console.error('Error processing payment for itinerary:', error);
    res.status(500).json({ error: error.message });
  }
};

const payMuseum = async (req, res) => {
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
    const BookedMuseum = tourist.BookedMuseums.find(
      (museum) => museum.MuseumName === museumName
    );

    if (!BookedMuseum) {
      return res.status(400).json({ msg: 'museum not found in booked activities. Please book the museum event first.' });
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
      return res.status(400).json({ msg: 'Insufficient funds in wallet.' });
    }

    // Deduct the ticket price from the tourist's wallet
    tourist.Wallet -= ticketPrice;
    if(tourist.BadgeLevelOfPoints ===1){
      tourist.Points+= 0.5* ticketPrice;
      if(tourist.Points>100000){
        tourist.BadgeLevelOfPoints=2;}
      else if(tourist.Points>500000){
        tourist.BadgeLevelOfPoints=3;
      }
    }
    else if(tourist.BadgeLevelOfPoints ===2){
      tourist.Points+= ticketPrice;
       if(tourist.Points>500000){
        tourist.BadgeLevelOfPoints=3;
      }

    }
    else if(tourist.BadgeLevelOfPoints ===3){
      tourist.Points+= 1.5*ticketPrice;
    }
    
    // Save the updated tourist information
    await tourist.save();

    // Respond with success and remaining wallet balance
    res.status(200).json({ msg: 'Payment successful!', MuseumName: museum.name, remainingWallet: tourist.Wallet ,BadgeLevelOfPoints: tourist.BadgeLevelOfPoints, Points:tourist.Points});
  } catch (error) {
    console.error('Error processing payment for museum:', error);
    res.status(500).json({ error: error.message });
  }
};

const payHP = async (req, res) => {
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
    const BookedHistPlace = tourist.BookedHistPlaces.find(
      (hp) => hp.HistPlaceName === HPName
    );

    if (!BookedHistPlace) {
      return res.status(400).json({ msg: 'hp not found in booked activities. Please book the museum event first.' });
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
      return res.status(400).json({ msg: 'Insufficient funds in wallet.' });
    }

    // Deduct the ticket price from the tourist's wallet
    tourist.Wallet -= ticketPrice;
    if(tourist.BadgeLevelOfPoints ===1){
      tourist.Points+= 0.5* ticketPrice;
      if(tourist.Points>100000){
        tourist.BadgeLevelOfPoints=2;}
      else if(tourist.Points>500000){
        tourist.BadgeLevelOfPoints=3;
      }
    }
    else if(tourist.BadgeLevelOfPoints ===2){
      tourist.Points+= ticketPrice;
       if(tourist.Points>500000){
        tourist.BadgeLevelOfPoints=3;
      }

    }
    else if(tourist.BadgeLevelOfPoints ===3){
      tourist.Points+= 1.5*ticketPrice;
    }
    
    // Save the updated tourist information
    await tourist.save();

    // Respond with success and remaining wallet balance
    res.status(200).json({ msg: 'Payment successful!', hpName: hp.name, remainingWallet: tourist.Wallet ,BadgeLevelOfPoints: tourist.BadgeLevelOfPoints, Points:tourist.Points});
  } catch (error) {
    console.error('Error processing payment for hp:', error);
    res.status(500).json({ error: error.message });
  }
};





module.exports = {createTourist, getTourist, updateTourist, searchProductTourist, filterActivities, filterProductByPriceTourist, ActivityRating, sortProductsDescendingTourist, sortProductsAscendingTourist, ViewAllUpcomingActivities, ViewAllUpcomingMuseumEventsTourist, getMuseumsByTagTourist, getHistoricalPlacesByTagTourist, ViewAllUpcomingHistoricalPlacesEventsTourist,viewProductsTourist, sortActivitiesPriceAscendingTourist, sortActivitiesPriceDescendingTourist, sortActivitiesRatingAscendingTourist, sortActivitiesRatingDescendingTourist, loginTourist, ViewAllUpcomingItinerariesTourist, sortItinerariesPriceAscendingTourist, sortItinerariesPriceDescendingTourist, filterItinerariesTourist, ActivitiesSearchAll, ItinerarySearchAll, MuseumSearchAll, HistoricalPlacesSearchAll, ProductRating, createComplaint, getComplaintsByTouristUsername,ChooseActivitiesByCategoryTourist,bookActivity,bookItinerary,bookMuseum,bookHistoricalPlace, ratePurchasedProduct, addPurchasedProducts, reviewPurchasedProduct, addCompletedItinerary, rateTourGuide, commentOnTourGuide, rateCompletedItinerary, commentOnItinerary, addCompletedActivities, addCompletedMuseumEvents, addCompletedHPEvents, rateCompletedActivity, rateCompletedMuseum, rateCompletedHP, commentOnActivity, commentOnMuseum, commentOnHP,deleteBookedActivity,deleteBookedItinerary,deleteBookedMuseum,deleteBookedHP,payActivity,updateWallet,updatepoints,payItinerary,payMuseum,payHP};
