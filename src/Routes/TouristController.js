// #Task route solution
const TouristModel = require('../Models/Tourist.js');
const AllUsernamesModel = require('../Models/AllUsernames.js');
const ActivityModel = require('../Models/Activity.js');
const ProductModel = require('../Models/Product.js');
//const MuseumModel = require('../Models/Museum.js');
//const ItineraryModel = require('../Models/Itinerary.js');
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
              Wallet: 0 // Initialize wallet to 0
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
   const { Username } = req.body;
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

      const filterActivities = async (req, res) => {
        const { Category, Price, Date } = req.body; // Extract category and price from the request body
        const query = {}; // Initialize an empty query object
        
        if (Category) {
          query.Category = Category; 
        }
        if (Price) {
          query.Price = Price;
        }
        if (Date) {
          query.Date = Date; 
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

      const filterProductByPriceTourist = async (req, res) => {
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
      };




    


module.exports = {createTourist, getTourist, updateTourist, searchProductTourist, filterActivities, filterProductByPriceTourist};
