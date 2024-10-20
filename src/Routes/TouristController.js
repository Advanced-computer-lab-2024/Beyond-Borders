// #Task route solution
const TouristModel = require('../Models/Tourist.js');
const AllUsernamesModel = require('../Models/AllUsernames.js');
const ActivityModel = require('../Models/Activity.js');
const ProductModel = require('../Models/Product.js');
const MuseumModel = require('../Models/Museums.js');
const HistoricalPlacesModel = require('../Models/HistoricalPlaces.js');
const HistoricalTagsModel = require('../Models/HistoricalTags.js');
const ComplaintsModel = require('../Models/Complaints.js');


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
              purchasedProducts: [] // Initialize purchasedProducts as an empty array
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
    // Check if the review is provided
    if (!review || review.trim() === '') {
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
    product.Reviews.push(review);
    await product.save();

    res.status(200).json({ msg: 'Review added successfully!', productName, review });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ error: error.message });
  }
};









module.exports = {createTourist, getTourist, updateTourist, searchProductTourist, filterActivities, filterProductByPriceTourist, ActivityRating, sortProductsDescendingTourist, sortProductsAscendingTourist, ViewAllUpcomingActivities, ViewAllUpcomingMuseumEventsTourist, getMuseumsByTagTourist, getHistoricalPlacesByTagTourist, ViewAllUpcomingHistoricalPlacesEventsTourist,viewProductsTourist, sortActivitiesPriceAscendingTourist, sortActivitiesPriceDescendingTourist, sortActivitiesRatingAscendingTourist, sortActivitiesRatingDescendingTourist, loginTourist, ViewAllUpcomingItinerariesTourist, sortItinerariesPriceAscendingTourist, sortItinerariesPriceDescendingTourist, filterItinerariesTourist, ActivitiesSearchAll, ItinerarySearchAll, MuseumSearchAll, HistoricalPlacesSearchAll, ProductRating, createComplaint, getComplaintsByTouristUsername,ChooseActivitiesByCategoryTourist,bookActivity,bookItinerary,bookMuseum,bookHistoricalPlace, ratePurchasedProduct, addPurchasedProducts, reviewPurchasedProduct};
