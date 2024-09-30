// #Task route solution
const TouristModel = require('../Models/Tourist.js');
const AllUsernamesModel = require('../Models/AllUsernames.js');

//const ActivityModel = require('../Models/Activity.js');
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

    


module.exports = {createTourist, getTourist, updateTourist, searchProductTourist};
