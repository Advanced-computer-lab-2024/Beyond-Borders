// #Task route solution
const TourGuideModel = require('../Models/TourGuide.js');
const Itinerary = require('../Models/Itinerary.js'); // Adjust the path as necessary
const DeactivatedItinerary = require('../Models/DeactivatedItineraries.js'); // Adjust the path as necessary
const DeleteRequestsModel = require('../Models/DeleteRequests.js');
const Tourist = require('../Models/Tourist.js'); // Update the path based on your project structure
const { default: mongoose } = require('mongoose');

// const createTourGuide = async(req,res) => {
//    //Destructure Name, Email, Age from the request body
//    const{Username,Email,Password,MobileNum,YearsOfExperience,PreviousWork} = req.body;
//    try{
//       //add a new user to the database with Name, Email and Age
//       const user = await TourGuideModel.create({Username,Email,Password,MobileNum,YearsOfExperience,PreviousWork});
//       //Send the created use as a JSON response with a 200 OK status 
//       res.status(200).json({msg:"Tour Guide is created!"});
//       //res.status(200).json(user);
//    } catch (error){
//       //If an error occurs, send a 400 Bad Request status with the error message
//       res.status(400).json({ error: error.message});
//    }
// }
const ReadTourGuideProfile = async(req,res) =>{
   try{
    const{username} = req.query;
    const TourGuide = await TourGuideModel.findOne({ Username: username }); // Find the user by name
    if (TourGuide) {
      res.status(200).json({TourGuide});
      
    }
    else{
        res.status(400).json({error : "Tour guide does not exist"});

    }
  } catch (error) {
    res.status(400).json({ error: error.message});
}
}

/*const updateTourGuideProfile = async (req, res) => {
  const { _id } = req.body;  // Extract the _id from the request body

  try {
      if (req.body.Username) {
          delete req.body.Username;
          return res.status(404).json({ msg: "Cannot update username" });
        }
    // Find and update the tourist with the fields provided in req.body
    const updatedTourGuide = await TourGuideModel.findByIdAndUpdate(_id, req.body, {
      new: true,            // Return the updated document
      runValidators: true,  // Ensure the updates respect schema validation rules
    });
    res.status(200).json(updatedTourGuide);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};*/


const updateTourGuideProfile = async (req, res) => {
  const { Username } = req.body;

  try {
    if (!Username) {
      return res.status(400).json({ msg: "Username is required to update the profile" });
    }

    // Prepare update data
    const updates = {
      Password: req.body.Password,
      Email: req.body.Email,
      MobileNum: req.body.MobileNum,
      YearsOfExperience: req.body.YearsOfExperience,
      PreviousWork: req.body.PreviousWork,
    };

    if (req.file) {
      updates.Logo = `/uploads/${req.file.filename}`; // Save the relative path of the uploaded file
    }

    const updatedTourGuide = await TourGuideModel.findOneAndUpdate(
      { Username },
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedTourGuide) {
      return res.status(404).json({ msg: "TourGuide not found" });
    }

    res.status(200).json(updatedTourGuide);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(400).json({ error: error.message });
  }
};

const  UpdateTourGuideEmail = async(req,res) =>{
try{
    const{Username , Email} = req.body;
    const TourGuide = await TourGuideModel.findOne({ Username: Username });
    const ID = TourGuide._id;
    if(TourGuide){
        const TourGuide = await TourGuideModel.findOneAndUpdate({_id: ID}, {Email}, {new: true});
        res.status(200).json({msg:"Tour Guide email is updated!"});
    }
    else{
        res.status(400).json({error : "Tour guide does not exist"});

    }
}
catch(error){
    res.status(400).json({error : error.message});
}
}
const  UpdateTourGuidePassword = async(req,res) =>{
    try{
        const{Username,Password , ConfirmPassword} = req.body;
        if(Password != ConfirmPassword){
            res.status(400).json("Both passwords are not identical")
        }
        const TourGuide = await TourGuideModel.findOne({ Username: Username });
        const ID = TourGuide._id;
        if(TourGuide){
            const TourGuide = await TourGuideModel.findOneAndUpdate({_id: ID}, {Password}, {new: true});
            res.status(200).json({msg:"Tour Guide password is updated!"});
        }
        else{
            res.status(400).json({error : "Tour guide does not exist"});

        }
    }
    catch(error){
        res.status(400).json({error : error.message});
    }
    }
    const  UpdateTourGuideMobileNum = async(req,res) =>{
        try{
            const{Username,MobileNum} = req.body;
            const TourGuide = await TourGuideModel.findOne({ Username: Username });
            const ID = TourGuide._id;
            if(TourGuide){
                const TourGuide = await TourGuideModel.findOneAndUpdate({_id: ID}, {MobileNum}, {new: true});
                res.status(200).json({msg:"Tour Guide mobile number is updated!"});
            }
            else{
                res.status(400).json({error : "Tour guide does not exist"});
            }
        }
        catch(error){
            res.status(400).json({error : error.message});
        }
    }
    const  UpdateTourGuideYearsofExperience= async(req,res) =>{
        try{
            const{Username,YearsOfExperience} = req.body;
            const TourGuide = await TourGuideModel.findOne({ Username: Username });
            const ID = TourGuide._id;
            if(TourGuide){
                const TourGuide = await TourGuideModel.findOneAndUpdate({_id: ID}, {YearsOfExperience}, {new: true});
                res.status(200).json({msg:"Your years of experience are updated!"});
            }
            else{
                res.status(400).json({error : "Tour guide does not exist"});
            }
        }
        catch(error){
            res.status(400).json({error : error.message});
        }
    }
    const  UpdateTourGuidePreviousWork = async(req,res) =>{
        try{
            const{Username,PreviousWork} = req.body;
            const TourGuide = await TourGuideModel.findOne({ Username: Username });
            const ID = TourGuide._id;
            if(TourGuide){
                const TourGuide = await TourGuideModel.findOneAndUpdate({_id: ID}, {PreviousWork}, {new: true});
                res.status(200).json({msg:"your previous work is updated!"});
            }
            else{
                res.status(400).json({error : "Tour guide does not exist"});
            }
        }
        catch(error){
            res.status(400).json({error : error.message});
        }
    }
    // const  UpdateTourGuideUserName = async(req,res) =>{
    //     try{
    //         const{Username,Email} = req.body;
    //         const existingUser = await TourGuideModel.findOne({ Username });
    //          if (existingUser) {
    //         return res.status(400).json({ error: "Username already exists!" });
    //         }
    //         const TourGuide = await TourGuideModel.findOne({ Email: Email });
    //         const ID = TourGuide._id;
    //         if(TourGuide){
    //             const TourGuide = await TourGuideModel.findOneAndUpdate({_id: ID}, {Username}, {new: true});
    //             res.status(200).json({msg:"your useername is updated!"});
    //         }
    //         else{
    //             res.status(400).json({error : "Tour guide does not exist"});
    //         }
    //     }
    //     catch(error){
    //         res.status(400).json({error : error.message});
    //     }



    // }




    // Itinerary Part As A TourGuide
    const { createItinerary } = require('./ItineraryController');
    const { readItineraryByTitle } = require('./ItineraryController');
    const { updateItineraryByTitle } = require('./ItineraryController');
    const { deleteItineraryByTitle } = require('./ItineraryController');
    const {getItinerarysByAuthor} = require('./ItineraryController');
// Assuming the tour guide will have other methods too, like managing itineraries

const createItineraryAsTourGuide = async (req, res) => {
  try {
    // You can add any additional logic specific to the tour guide here (e.g., verify the tour guide's role)

    // Call the existing createItinerary method and pass the req, res objects
    await createItinerary(req, res);
    
  } catch (error) {
    res.status(500).json({ error: "An error occurred while creating the itinerary." });
  }
};
// Import the Itinerary model
const ItineraryModel = require('../Models/Itinerary.js');

// Search itineraries by title

const readItineraryAsTourGuide = async (req, res) => {
    try {
      // You can add any additional logic specific to the tour guide here (e.g., verify the tour guide's role)
      
      // Call the existing readItineraryByTitle method and pass the req, res objects
      await readItineraryByTitle(req, res);
      
    } catch (error) {
      res.status(500).json({ error: "An error occurred while retrieving the itinerary." });
    }
  };
  const updateItineraryAsTourGuide = async (req, res) => {
    try {
      // You can add any additional logic specific to the tour guide here (e.g., verify the tour guide's role)
      
      // Call the existing updateItineraryByTitle method and pass the req, res objects
      await updateItineraryByTitle(req, res);
      
    } catch (error) {
      res.status(500).json({ error: "An error occurred while updating the itinerary." });
    }
  };
  const deleteItineraryAsTourGuide = async (req, res) => {
    try {
      // You can add any additional logic specific to the tour guide here (e.g., verify the tour guide's role)
      
      // Call the existing deleteItineraryByTitle method and pass the req, res objects
      await deleteItineraryByTitle(req, res);
      
    } catch (error) {
      res.status(500).json({ error: "An error occurred while deleting the itinerary." });
    }
  };


  const loginTourGuide = async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Validate input
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required." });
      }
  
      // Find the Tourguide by username
      const tourguide = await TourGuideModel.findOne({ Username: username });
      if (!tourguide) {
        return res.status(401).json({ error: "Invalid username." });
      }
  
      // Check if the password matches
      if (tourguide.Password !== password) {
        return res.status(401).json({ error: "Invalid password." });
      }
      // Increment LoginCount
      tourguide.LoginCount = tourguide.LoginCount + 1; // If LoginCount doesn't exist, set it to 0 and increment
      await tourguide.save();

      // Successful authentication
      res.status(200).json({ message: "Login successful!", tourguide });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  const getItenrarysByTourGuide = async (req, res) => {
    try{
      await getItinerarysByAuthor(req,res);
    }
    catch(error){
      res.status(400).json({ error: error.message });
    }
  };

  const deactivateItinerary = async (req, res) => {
    try {
        const { title } = req.body; // Get the title from the request body

        // Find the itinerary by title
        const itinerary = await Itinerary.findOne({ Title: title });
        if (!itinerary) {
            return res.status(404).json({ error: "Itinerary not found!" });
        }

        // Create a new deactivated itinerary document from the found itinerary
        const deactivatedItinerary = new DeactivatedItinerary({
            Title: itinerary.Title,
            Activities: itinerary.Activities,
            Locations: itinerary.Locations,
            Timeline: itinerary.Timeline,
            Language: itinerary.Language,
            Price: itinerary.Price,
            Date: itinerary.Date,
            accessibility: itinerary.accessibility,
            pickupLocation: itinerary.pickupLocation,
            dropoffLocation: itinerary.dropoffLocation,
            isBooked: itinerary.isBooked,
            Tags: itinerary.Tags,
            AuthorUsername: itinerary.AuthorUsername,
            Comments: itinerary.Comments,
            Ratings: itinerary.Ratings,
            RatingCount: itinerary.RatingCount
        });

        // Save the new deactivated itinerary
        await deactivatedItinerary.save();

        // Delete the original itinerary
        await Itinerary.deleteOne({ Title: title });

        // Respond with success message
        res.status(200).json({ msg: "Itinerary has been deactivated!" });
    } catch (error) {
        // Handle any errors that occur during the process
        res.status(500).json({ error: error.message });
    }
};
  
const activateItinerary = async (req, res) => {
  try {
      const { title } = req.body; // Get the title from the request body

      // Find the deactivated itinerary by title
      const deactivatedItinerary = await DeactivatedItinerary.findOne({ Title: title });
      if (!deactivatedItinerary) {
          return res.status(404).json({ error: "Deactivated itinerary not found!" });
      }

      // Create a new itinerary document from the deactivated itinerary
      const itinerary = new Itinerary({
          Title: deactivatedItinerary.Title,
          Activities: deactivatedItinerary.Activities,
          Locations: deactivatedItinerary.Locations,
          Timeline: deactivatedItinerary.Timeline,
          Language: deactivatedItinerary.Language,
          Price: deactivatedItinerary.Price,
          Date: deactivatedItinerary.Date,
          accessibility: deactivatedItinerary.accessibility,
          pickupLocation: deactivatedItinerary.pickupLocation,
          dropoffLocation: deactivatedItinerary.dropoffLocation,
          isBooked: deactivatedItinerary.isBooked,
          Tags: deactivatedItinerary.Tags,
          AuthorUsername: deactivatedItinerary.AuthorUsername,
          Comments: deactivatedItinerary.Comments,
          Ratings: deactivatedItinerary.Ratings,
          RatingCount: deactivatedItinerary.RatingCount
      });

      // Save the new itinerary
      await itinerary.save();

      // Delete the original deactivated itinerary
      await DeactivatedItinerary.deleteOne({ Title: title });

      // Respond with success message
      res.status(200).json({ msg: "Itinerary has been reactivated!" });
  } catch (error) {
      // Handle any errors that occur during the process
      res.status(500).json({ error: error.message });
  }
};

const viewMyDeactivatedItinerariesTourGuide = async (req, res) => {
  try {
    // Assuming you get the author's username from query parameters
    const { TourGuide } = req.query; 
    
    // Validate that AuthorUsername is provided
    if (!TourGuide) {
      return res.status(400).json({ error: "TourGuide username is required." });
    }

    const itineraries = await DeactivatedItinerary.find({ AuthorUsername: TourGuide });

    if (!itineraries.length) {
      return res.status(404).json({ error: "You have not created any itineraries." });
    }

    res.status(200).json(itineraries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const decrementLoginCountTourGuide = async (req, res) => {
  try {
    const { username } = req.body;

    // Find the seller by username and decrement the LoginCount by 1
    const updatedSeller = await TourGuideModel.findOneAndUpdate(
      { Username: username },
      { $inc: { LoginCount: -1 } }, // Decrement LoginCount by 1
      { new: true } // Return the updated document
    );

    // Check if the seller was found and updated
    if (!updatedSeller) {
      return res.status(404).json({ error: "Tour guide not found" });
    }

    res.status(200).json({ msg: "Login count decremented", updatedSeller });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const requestDeleteAccountTourGuide = async (req, res) => {
  try {
      const { Username } = req.body;  
      await DeleteRequestsModel.create({Username : Username,Type: "Tour Guide"});
      res.status(200).json({ msg: "You have reqeuested to delete your account, an admin will view your request!" });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

const allNotificationsReadtg = async (req, res) => {
  const { username } = req.body; // Extract username from the request body
  try {
    if (!username) {
      return res.status(400).json({ error: "Username is required." });
    }

    const updatedAdvertiser = await TourGuideModel.findOneAndUpdate(
      { Username: username }, // Find the advertiser by username
      { $set: { "Notifications.$[].Read": true } }, // Update all notifications to `Read: true`
      { new: true } // Return the updated document
    );

    if (!updatedAdvertiser) {
      return res.status(404).json({ error: "Advertiser not found." });
    }

    res.status(200).json({
      message: "All notifications marked as read successfully.",
      advertiser: updatedAdvertiser,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const areAllNotificationsReadtg = async (req, res) => {
  const { username } = req.query; // Extract username from query

  try {
    if (!username) {
      return res.status(400).json({ error: "Username is required." });
    }

    // Find the advertiser by username and select the Notifications field
    const advertiser = await TourGuideModel.findOne({ Username: username }, "Notifications");

    if (!advertiser) {
      return res.status(404).json({ error: "Advertiser not found." });
    }

    // Check if all notifications are marked as `Read: true`
    const allRead = advertiser.Notifications.every(notification => notification.Read);

    res.status(200).json({ allRead }); // Return true or false
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAdvertiserNotificationstg = async (req, res) => {
  const { username } = req.query; // Extract username from query parameters

  try {
    if (!username) {
      return res.status(400).json({ error: "Username is required." });
    }

    // Find the advertiser and retrieve the Notifications field
    const advertiser = await TourGuideModel.findOne(
      { Username: username },
      "Notifications" // Only select the Notifications field
    );

    if (!advertiser) {
      return res.status(404).json({ error: "Advertiser not found." });
    }

    // Return all notifications
    res.status(200).json({ notifications: advertiser.Notifications });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const calculateTourGuideRevenue = async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: 'Tour guide username is required' });
  }

  try {
    // Step 1: Find all itineraries authored by the tour guide
    const itineraries = await Itinerary.find({ AuthorUsername: username });

    if (itineraries.length === 0) {
      return res.status(404).json({ message: 'No itineraries found for this tour guide' });
    }

    let totalRevenue = 0;

    // Step 2: Traverse the tourists to find booked itineraries for this guide
    for (const itinerary of itineraries) {
      const bookedItineraryName = itinerary.Title;

      // Find all tourists who have booked this itinerary
      const tourists = await Tourist.find({
        'BookedItineraries.ItineraryName': bookedItineraryName,
        'BookedItineraries.booked': true
      });

      // Calculate revenue for this itinerary
      const itineraryRevenue = tourists.length * itinerary.Price;
      totalRevenue += itineraryRevenue;
    }

    // Step 3: Respond with the total revenue
    res.status(200).json({
      tourGuideUsername: username,
      totalRevenue,
    });
  } catch (error) {
    console.error('Error calculating revenue:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const getUsersWhoBookedItinerary = async (req, res) => {
  const { username, title } = req.query;

  if (!username || !title) {
    return res.status(400).json({ error: 'Tour guide username and itinerary title are required' });
  }

  try {
    // Find the itinerary authored by the given tour guide and matching the title
    const itinerary = await Itinerary.findOne({ AuthorUsername: username, Title: title });

    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }

    // Find all tourists who have booked this itinerary
    const tourists = await Tourist.find({
      'BookedItineraries.ItineraryName': title,
      'BookedItineraries.booked': true,
    });

    const numberOfBookings = tourists.length;

    res.status(200).json({
      itineraryTitle: title,
      numberOfUsersBooked: numberOfBookings,
    });
  } catch (error) {
    console.error('Error fetching booking data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getRevenueFromItinerary = async (req, res) => {
  const { username, title } = req.query;

  if (!username || !title) {
    return res.status(400).json({ error: 'Tour guide username and itinerary title are required' });
  }

  try {
    // Find the itinerary authored by the given tour guide and matching the title
    const itinerary = await Itinerary.findOne({ AuthorUsername: username, Title: title });

    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }

    // Find all tourists who have booked this itinerary
    const tourists = await Tourist.find({
      'BookedItineraries.ItineraryName': title,
      'BookedItineraries.booked': true,
    });

    // Calculate total revenue
    const totalRevenue = tourists.length * itinerary.Price;

    res.status(200).json({
      itineraryTitle: title,
      totalRevenue,
    });
  } catch (error) {
    console.error('Error calculating revenue:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const filterTourGuideItineraries = async (req, res) => {
  const { username, title, date, month } = req.query;

  if (!username) {
    return res.status(400).json({ error: 'Tour guide username is required' });
  }

  try {
    // Build the query dynamically
    const query = { AuthorUsername: username };

    if (title) {
      query.Title = { $regex: title, $options: 'i' }; // Case-insensitive match
    }

    if (date) {
      query.Date = new Date(date); // Exact date match
    }

    if (month) {
      const year = new Date().getFullYear(); // Default to current year
      const startOfMonth = new Date(year, month - 1, 1); // Start of the month
      const endOfMonth = new Date(year, month, 0); // End of the month
      query.Date = { $gte: startOfMonth, $lte: endOfMonth }; // Match the month range
    }

    // Execute the query
    const itineraries = await Itinerary.find(query);

    if (itineraries.length === 0) {
      return res.status(404).json({ message: 'No itineraries found matching the criteria' });
    }

    // Return the filtered itineraries
    res.status(200).json(itineraries);
  } catch (error) {
    console.error('Error filtering itineraries:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getTouristsByItineraryAndMonth = async (req, res) => {
  try {
    const { itineraryTitle, month } = req.query; // Extract query parameters
    if (!itineraryTitle || !month) {
      return res.status(400).json({ error: 'Itinerary title and month are required' });
    }

    // Convert month to integer (0-11, where 0 is January, 11 is December)
    const monthNumber = parseInt(month) - 1; // Adjust the month value (0-based index)

    // Get all tourists that booked itineraries with the specified title in the given month
    const tourists = await Tourist.find({
      'BookedItineraries.ItineraryName': itineraryTitle,
      'BookedItineraries.DateOfBooking': {
        $gte: new Date(new Date().getFullYear(), monthNumber, 1), // Start of the month
        $lt: new Date(new Date().getFullYear(), monthNumber + 1, 1), // Start of the next month
      },
    });

    // Count how many tourists booked the specified itinerary
    const count = tourists.length;

    // Send the count of tourists as the response
    return res.json({ totalTourists: count });

  } catch (error) {
    console.error('Error fetching tourists:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getHighestRevenueItinerary = async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: 'Tour guide username is required' });
  }

  try {
    // Step 1: Get the current month and year
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1); // Start of current month
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0); // End of current month

    // Step 2: Find all itineraries authored by the tour guide
    const itineraries = await Itinerary.find({
      AuthorUsername: username,
      Date: { $gte: monthStart, $lte: monthEnd }, // Filter itineraries for the current month
    });

    if (itineraries.length === 0) {
      return res.status(404).json({ message: 'No itineraries found for this tour guide in the current month' });
    }

    let highestRevenueItinerary = null;
    let highestRevenue = 0;

    // Step 3: Iterate through each itinerary to calculate its revenue
    for (const itinerary of itineraries) {
      const bookedItineraryName = itinerary.Title;

      // Find all tourists who booked this itinerary
      const tourists = await Tourist.find({
        'BookedItineraries.ItineraryName': bookedItineraryName,
        'BookedItineraries.booked': true,
        'BookedItineraries.DateOfBooking': {
          $gte: monthStart,
          $lte: monthEnd, // Filter bookings within the current month
        },
      });

      // Calculate revenue for the itinerary
      const revenue = tourists.length * itinerary.Price;

      // Check if this is the highest revenue-generating itinerary
      if (revenue > highestRevenue) {
        highestRevenue = revenue;
        highestRevenueItinerary = itinerary.Title;
      }
    }

    // Step 4: Respond with the highest revenue itinerary
    res.status(200).json({
      tourGuideUsername: username,
      highestRevenueItinerary,
      revenue: highestRevenue,
    });
  } catch (error) {
    console.error('Error fetching highest revenue itinerary:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const calculateCurrentMonthRevenue = async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: 'Tour guide username is required' });
  }

  try {
    // Step 1: Get the current month and year
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1); // Start of the current month
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0); // End of the current month

    // Step 2: Find all itineraries authored by the tour guide
    const itineraries = await Itinerary.find({
      AuthorUsername: username,
      Date: { $gte: monthStart, $lte: monthEnd }, // Filter itineraries for the current month
    });

    if (itineraries.length === 0) {
      return res.status(404).json({ message: 'No itineraries found for this tour guide in the current month' });
    }

    let totalRevenue = 0;

    // Step 3: Iterate through each itinerary to calculate revenue
    for (const itinerary of itineraries) {
      const bookedItineraryName = itinerary.Title;

      // Find all tourists who booked this itinerary
      const tourists = await Tourist.find({
        'BookedItineraries.ItineraryName': bookedItineraryName,
        'BookedItineraries.booked': true,
        'BookedItineraries.DateOfBooking': {
          $gte: monthStart,
          $lte: monthEnd, // Filter bookings within the current month
        },
      });

      // Calculate revenue for the itinerary
      const revenue = tourists.length * itinerary.Price;
      totalRevenue += revenue; // Add to the total revenue
    }

    // Step 4: Respond with the total revenue
    res.status(200).json({
      tourGuideUsername: username,
      totalRevenue,
    });
  } catch (error) {
    console.error('Error calculating revenue for the current month:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getTotalTouristsForTourGuide = async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: 'Tour guide username is required' });
  }

  try {
    // Step 1: Find all itineraries created by the tour guide
    const itineraries = await Itinerary.find({ AuthorUsername: username });

    if (!itineraries.length) {
      return res.status(404).json({ message: 'No itineraries found for this tour guide' });
    }

    // Step 2: Get the titles of all itineraries created by this tour guide
    const itineraryTitles = itineraries.map(itinerary => itinerary.Title);

    // Step 3: Count the total number of tourists who booked any of these itineraries
    const totalTourists = await Tourist.countDocuments({
      'BookedItineraries.ItineraryName': { $in: itineraryTitles },
      'BookedItineraries.booked': true,
    });

    // Step 4: Respond with the total number of tourists
    res.status(200).json({
      tourGuideUsername: username,
      totalTourists,
    });
  } catch (error) {
    console.error('Error fetching tourist count:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const calculateRevenueForItinerary = async (req, res) => {
  const { title, date, month } = req.query;

  if (!title || (!date && !month)) {
    return res.status(400).json({ error: 'Itinerary title and either date or month are required.' });
  }

  try {
    // Find the itinerary by title
    const itinerary = await Itinerary.findOne({ Title: title });

    if (!itinerary) {
      return res.status(404).json({ error: 'Itinerary not found.' });
    }

    // Prepare date filters based on input
    let dateFilter = {};
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0); // Set to start of the day

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999); // Set to end of the day

      dateFilter = {
        'BookedItineraries.DateOfBooking': { $gte: startOfDay, $lte: endOfDay },
      };
    } else if (month) {
      const year = new Date().getFullYear(); // Default to current year
      const startOfMonth = new Date(year, month - 1, 1); // Start of the month
      const endOfMonth = new Date(year, month, 0); // End of the month
      dateFilter = {
        'BookedItineraries.DateOfBooking': { $gte: startOfMonth, $lte: endOfMonth },
      };
    }

    // Find all tourists who booked this itinerary within the date or month range
    const tourists = await Tourist.find({
      'BookedItineraries.ItineraryName': title,
      'BookedItineraries.booked': true,
      ...dateFilter,
    });

    // Calculate total revenue
    const revenue = tourists.length * itinerary.Price;

    // Respond with the calculated revenue
    res.status(200).json({
      itineraryTitle: title,
      revenue,
      bookings: tourists.length,
    });
  } catch (error) {
    console.error('Error calculating itinerary revenue:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = {ReadTourGuideProfile , UpdateTourGuideEmail , UpdateTourGuidePassword, UpdateTourGuideMobileNum , UpdateTourGuideYearsofExperience ,UpdateTourGuidePreviousWork ,createItineraryAsTourGuide,readItineraryAsTourGuide,updateItineraryAsTourGuide,deleteItineraryAsTourGuide, updateTourGuideProfile,loginTourGuide,getItenrarysByTourGuide, deactivateItinerary,activateItinerary, viewMyDeactivatedItinerariesTourGuide, 
  decrementLoginCountTourGuide,requestDeleteAccountTourGuide, allNotificationsReadtg, areAllNotificationsReadtg, getAdvertiserNotificationstg, calculateTourGuideRevenue, getUsersWhoBookedItinerary, getRevenueFromItinerary, filterTourGuideItineraries, getTouristsByItineraryAndMonth, getHighestRevenueItinerary, calculateCurrentMonthRevenue, getTotalTouristsForTourGuide, calculateRevenueForItinerary};
