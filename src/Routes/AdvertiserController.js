const AdvertiserModel = require('../Models/Advertiser.js');
const ActivityModel = require('../Models/Activity.js');
const TouristModel = require('../Models/Tourist.js');

const TagsModel = require('../Models/Tags.js');
const NewActivityCategoryModel = require('../Models/ActivityCategory.js');
const DeleteRequestsModel = require('../Models/DeleteRequests.js');

const { default: mongoose } = require('mongoose');


// const createAdvertiser = async(req,res) => {
//         //Destructure Name, Email, Age from the request body
//         const{Username,Email,Password,Website,Hotline,CompanyProfile} = req.body;
//         try{
//            //add a new user to the database with Name, Email and Age
//            const user = await AdvertiserModel.create({Username,Email,Password,Website,Hotline,CompanyProfile});
//            //Send the created use as a JSON response with a 200 OK status 
//            res.status(200).json({msg:"Advertiser is created!"});
//            //res.status(200).json(user);
//         } catch (error){
//            //If an error occurs, send a 400 Bad Request status with the error message
//            res.status(400).json({ error: error.message});
//         }
//      }
     const ReadAdvertiserProfile = async(req,res) =>{
        try{
         const{username} = req.query;
         const Advertiser = await AdvertiserModel.findOne({ Username: username });
         if (Advertiser) {
           res.status(200).json({Advertiser});
         }
         else{
             res.status(400).json({error : "Advertiser does not exist"});
         }
       } catch (error) {
         res.status(400).json({ error: error.message});
     }
     }
    //  const updateAdvertiser = async (req, res) => {
    //     const { username } = req.body;  // Extract the _id from the request body
      
    //     try {
    //         if (req.body.Username) {
    //             delete req.body.Username;
    //             return res.status(404).json({ msg: "Cannot update username" });
    //           }
    //       // Find and update the tourist with the fields provided in req.body
    //       const updatedAdvertiser = await AdvertiserModel.findOneAndUpdate({Username : username}, req.body, {
    //         new: true,            // Return the updated document
    //         runValidators: true,  // Ensure the updates respect schema validation rules
    //       });
    //       res.status(200).json(updatedAdvertiser);
    //     } catch (error) {
    //       // Send a 400 error with the error message if something goes wrong
    //       res.status(400).json({ error: error.message });
    //     }
    //   };

    const updateAdvertiser = async (req, res) => {
      const { Username } = req.body;
    
      try {
        if (!Username) {
          return res.status(400).json({ msg: "Username is required to update the profile" });
        }
    
        // Prepare updates
        const updates = {
          Password: req.body.Password,
          Email: req.body.Email,
          Hotline: req.body.Hotline,
          CompanyProfile: req.body.CompanyProfile,
          Website: req.body.Website,
        };
    
        // If a file is uploaded, add the file path
        if (req.file) {
          updates.Logo = `/uploads/${req.file.filename}`;
        }
    
        const updatedAdvertiser = await AdvertiserModel.findOneAndUpdate(
          { Username },
          updates,
          { new: true, runValidators: true }
        );
    
        if (!updatedAdvertiser) {
          return res.status(404).json({ msg: "Advertiser not found" });
        }
    
        res.status(200).json(updatedAdvertiser);
      } catch (error) {
        console.error("Error updating profile:", error);
        res.status(400).json({ error: error.message });
      }
    };
  
    
      const createNewActivity = async (req, res) => {
        // Destructure fields from the request body
        const { AdvertiserName, Name, Date, Time, SpecialDiscount, BookingOpen, Price, Location, Category, Tags } = req.body;
      
        try {
          // Check if the category exists
          const existingCategory = await NewActivityCategoryModel.findOne({ NameOfCategory: Category });
          if (!existingCategory) {
            return res.status(400).json({ error: "Selected category does not exist!" });
          }
      
          // Check if all provided tags exist
          const existingTags = await TagsModel.find({ NameOfTags: { $in: Tags } });
          if (existingTags.length !== Tags.length) {
            return res.status(400).json({ error: "One or more tags do not exist!" });
          }

          // Check if an activity with the same name already exists
          const existingActivity = await ActivityModel.findOne({ Name: Name });
          if (existingActivity) {
              return res.status(400).json({ error: "Activity with this name already exists!" });
          }
      
          // Create the new activity
          const newActivity = await ActivityModel.create({AdvertiserName,Name,Date,Time,SpecialDiscount,BookingOpen,
            Price,Location,Category,Tags, Rating:0, RatingCount:0, Comments: [], isBooked: false, flagged:false});
      
          // Send the created activity as a JSON response with a 200 OK status
          res.status(200).json({ msg: "New activity is created!"});
          
        } catch (error) {
          // If an error occurs, send a 400 Bad Request status with the error message
          res.status(400).json({ error: error.message });
        }
      };

      const readActivity = async (req, res) => {
        // Destructure fields from the request body
        const {Name} = req.query;
      
        try {
          // Check if an activity with the same name already exists
          const existingActivity = await ActivityModel.findOne({ Name: Name });
          if (existingActivity) {
            res.status(200).json(existingActivity);
          }
          else{
            res.status(400).json({ error: "no activity with this name!" });
          }
        } catch (error) {
          // If an error occurs, send a 400 Bad Request status with the error message
          res.status(400).json({ error: error.message });
        }
      };

    //   const updateActivity = async (req, res) => {
    //     // Destructure fields from the request body
    //     const { AdvertiserName, Name, Date, Time, SpecialDiscount, BookingOpen, Price, Location, Category, Tags } = req.body;
    
    //     try {
    //         // Check if the activity exists with the provided name and advertiser name
    //         const existingActivity = await ActivityModel.findOne({ Name: Name, AdvertiserName: AdvertiserName });
    //         if (!existingActivity) {
    //             return res.status(404).json({ error: "Activity not found for the given advertiser." });
    //         }
    
    //         // If Category is provided, check if it exists
    //         if (Category) {
    //             const existingCategory = await NewActivityCategoryModel.findOne({ NameOfCategory: Category });
    //             if (!existingCategory) {
    //                 return res.status(400).json({ error: "Selected category does not exist!" });
    //             }
    //         }
    
    //         // If Tags are provided, check if they exist
    //         if (Tags && Tags.length > 0) {
    //             const existingTags = await TagsModel.find({ NameOfTags: { $in: Tags } });
    //             if (existingTags.length !== Tags.length) {
    //                 return res.status(400).json({ error: "One or more tags do not exist!" });
    //             }
    //         }
    
    //         // Prepare an object with the fields to update (excluding AdvertiserName and Name)
    //         const updateFields = {
    //             Date,
    //             Time,
    //             SpecialDiscount,
    //             BookingOpen,
    //             Price,
    //             Location,
    //             Category,
    //             Tags
    //         };
    
    //         // Filter out any undefined values to avoid updating fields with undefined
    //         Object.keys(updateFields).forEach(key => updateFields[key] === undefined && delete updateFields[key]);
    
    //         // Update the activity
    //         const updatedActivity = await ActivityModel.findOneAndUpdate(
    //             { Name: Name, AdvertiserName: AdvertiserName }, // Find by Name and AdvertiserName
    //             { $set: updateFields }, // Update only the specified fields
    //             { new: true } // Return the updated document
    //         );
    
    //         // Send the updated activity as a JSON response with a 200 OK status
    //         res.status(200).json({ msg: "Activity updated successfully!", activity: updatedActivity });
    //     } catch (error) {
    //         // If an error occurs, send a 400 Bad Request status with the error message
    //         res.status(400).json({ error: error.message });
    //     }
    // };

    const updateActivity = async (req, res) => {
      // Destructure fields from the request body
      const { AdvertiserName, Name, Date, Time, SpecialDiscount, BookingOpen, Price, Location, Category, Tags } = req.body;
  
      try {
          // Check if the activity exists with the provided name and advertiser name
          const existingActivity = await ActivityModel.findOne({ Name: Name, AdvertiserName: AdvertiserName });
          if (!existingActivity) {
              return res.status(404).json({ error: "Activity not found for the given advertiser." });
          }
  
          // If Category is provided, check if it exists
          if (Category) {
              const existingCategory = await NewActivityCategoryModel.findOne({ NameOfCategory: Category });
              if (!existingCategory) {
                  return res.status(400).json({ error: "Selected category does not exist!" });
              }
          }
  
          // If Tags are provided, check if they exist
          if (Tags && Tags.length > 0) {
              const existingTags = await TagsModel.find({ NameOfTags: { $in: Tags } });
              if (existingTags.length !== Tags.length) {
                  return res.status(400).json({ error: "One or more tags do not exist!" });
              }
          }

          if (existingActivity.BookingOpen === false && BookingOpen === true) {
                        // Notify all users in SendNotificationTo
                        for (const subscriber of existingActivity.SendNotificationTo || []) {
                            const { username } = subscriber;
            
                            // Find the corresponding tourist
                            const tourist = await TouristModel.findOne({ Username: username });
                            if (tourist) {
                                // Add a notification about the booking opening
                                tourist.Notifications.push({
                                    NotificationText: `The activity "${existingActivity.Name}" is now open for booking!`,
                                    Read: false,
                                });
                                await tourist.save(); // Save the updated tourist document
                            }
                        }
            
                        // Clear the SendNotificationTo array after sending notifications
                        existingActivity.SendNotificationTo = [];
                       // await existingActivity.save();

                    } 
            
  
          // Prepare an object with the fields to update (excluding AdvertiserName and Name)
          const updateFields = {
              Date,
              Time,
              SpecialDiscount,
              BookingOpen,
              Price,
              Location,
              Category,
              Tags
          };
  
          // Filter out any undefined values to avoid updating fields with undefined
          Object.keys(updateFields).forEach(key => updateFields[key] === undefined && delete updateFields[key]);
  
          // Update the activity
          const updatedActivity = await ActivityModel.findOneAndUpdate(
              { Name: Name, AdvertiserName: AdvertiserName }, // Find by Name and AdvertiserName
              { $set: updateFields }, // Update only the specified fields
              { new: true } // Return the updated document
          );
          
          // Send the updated activity as a JSON response with a 200 OK status
          res.status(200).json({ msg: "Activity updated successfully!", activity: updatedActivity });
      } catch (error) {
          // If an error occurs, send a 400 Bad Request status with the error message
          res.status(400).json({ error: error.message });
      }
  };
    
  //   const updateActivity = async (req, res) => {
  //     const { AdvertiserName, Name, Date, Time, SpecialDiscount, BookingOpen, Price, Location, Category, Tags } = req.body;
  
  //     try {
  //         // Check if the activity exists with the provided name and advertiser name
  //         const existingActivity = await ActivityModel.findOne({ Name: Name, AdvertiserName: AdvertiserName });
  //         if (!existingActivity) {
  //             return res.status(404).json({ error: "Activity not found for the given advertiser." });
  //         }
  
  //         // If Category is provided, check if it exists
  //         if (Category) {
  //             const existingCategory = await NewActivityCategoryModel.findOne({ NameOfCategory: Category });
  //             if (!existingCategory) {
  //                 return res.status(400).json({ error: "Selected category does not exist!" });
  //             }
  //         }
  
  //         // If Tags are provided, check if they exist
  //         if (Tags && Tags.length > 0) {
  //             const existingTags = await TagsModel.find({ NameOfTags: { $in: Tags } });
  //             if (existingTags.length !== Tags.length) {
  //                 return res.status(400).json({ error: "One or more tags do not exist!" });
  //             }
  //         }
  
  //         // Check if BookingOpen is changing
  //         if (existingActivity.BookingOpen === false && BookingOpen === true) {
  //             // Notify all users in SendNotificationTo
  //             for (const subscriber of existingActivity.SendNotificationTo || []) {
  //                 const { username } = subscriber;
  
  //                 // Find the corresponding tourist
  //                 const tourist = await TouristModel.findOne({ Username: username });
  //                 if (tourist) {
  //                     // Add a notification about the booking opening
  //                     tourist.Notifications.push({
  //                         NotificationText: `The activity "${existingActivity.Name}" is now open for booking!`,
  //                         Read: false,
  //                     });
  //                     await tourist.save(); // Save the updated tourist document
  //                 }
  //             }
  
  //             // Clear the SendNotificationTo array after sending notifications
  //             existingActivity.SendNotificationTo = [];
  //         } 
  

  //         // Prepare an object with the fields to update (excluding AdvertiserName and Name)
  //         const updateFields = {
  //             Date,
  //             Time,
  //             SpecialDiscount,
  //             BookingOpen,
  //             Price,
  //             Location,
  //             Category,
  //             Tags,
  //         };
  
  //         // Filter out any undefined values to avoid updating fields with undefined
  //         Object.keys(updateFields).forEach(key => updateFields[key] === undefined && delete updateFields[key]);
  
  //         // Update the activity
  //         const updatedActivity = await ActivityModel.findOneAndUpdate(
  //             { Name: Name, AdvertiserName: AdvertiserName }, // Find by Name and AdvertiserName
  //             { $set: updateFields }, // Update only the specified fields
  //             { new: true } // Return the updated document
  //         );
  
  //         // Save the updated activity if notifications were sent
  //         await existingActivity.save();
  
  //         // Send the updated activity as a JSON response with a 200 OK status
  //         res.status(200).json({ msg: "Activity updated successfully!", activity: updatedActivity });
  //     } catch (error) {
  //         // If an error occurs, send a 400 Bad Request status with the error message
  //         res.status(400).json({ error: error.message });
  //     }
  // };
  
    const deleteActivity = async (req, res) => {
      const { AdvertiserName, Name } = req.body;
  
      try {
          const existingActivity = await ActivityModel.findOne({ Name: Name, AdvertiserName: AdvertiserName });
          if (!existingActivity) {
              return res.status(404).json({ error: "Activity not found for the given advertiser." });
          }
  
          await ActivityModel.findOneAndDelete({ Name: Name });
          res.status(200).json({ message: "Activity deleted successfully!" }); // Send a success response
      } catch (error) {
          res.status(400).json({ error: error.message });
      }
  };
  

  const getActivitiesByAuthor = async (req, res) => {
    try {
      // Assuming you get the author's username from query parameters
      const { AuthorUsername } = req.query; 
      
      // Validate that AuthorUsername is provided
      if (!AuthorUsername) {
        return res.status(400).json({ error: "Author username is required." });
      }
  
      const activities = await ActivityModel.find({ AdvertiserName: AuthorUsername });
  
      if (!activities.length) {
        return res.status(404).json({ error: "You have not created any activities." });
      }
  
      res.status(200).json(activities);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // const getActivitiesByAuthor = async (req, res) => {
  //   try {
  //     const {AuthorUsername} = req.body;  // Assuming you get the author's ID from the authenticated user
      
  //     const activities = await ActivityModel.find({ AdvertiserName: AuthorUsername });
  
  //     if (!activities.length) {
  //       return res.status(404).json({ error : "You have not created an activities" });
  //     }
  
  //     res.status(200).json(activities);
  //   } catch (error) {
  //     res.status(400).json({ error: error.message });
  //   }
  // };
  
  const loginAdvertiser = async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Validate input
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required." });
      }
  
      // Find the advertiser by username
      const advertiser = await AdvertiserModel.findOne({ Username: username });
      if (!advertiser) {
        return res.status(401).json({ error: "Invalid username." });
      }
  
      // Check if the password matches
      if (advertiser.Password !== password) {
        return res.status(401).json({ error: "Invalid password." });
      }

      // Increment LoginCount
      advertiser.LoginCount = advertiser.LoginCount + 1; // If LoginCount doesn't exist, set it to 0 and increment
      await advertiser.save();
      
      // Successful authentication
      res.status(200).json({ message: "Login successful!", advertiser });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  const updateAdvertiserPassword = async (req, res) => {
    const { Username, newPassword } = req.body;

    try {
        const existingUser = await AdvertiserModel.findOne({ Username:Username });

        //Redundant code but extra precaution as you will never do this except after logging in
        if (!existingUser) {
            return res.status(404).json({ error: "User not found!" });
        }

        // Update the password for the admin
        existingUser.Password = newPassword; // You might want to hash the password before saving
        await existingUser.save();

        // Send a success response
        res.status(200).json({ msg: "Password updated successfully!" });
    } catch (error) {
        // If an error occurs, send a 400 Bad Request status with the error message
        res.status(400).json({ error: error.message });
    }
};

const decrementLoginCountAdvertiser = async (req, res) => {
  try {
    const { username } = req.body;

    // Find the seller by username and decrement the LoginCount by 1
    const updatedSeller = await AdvertiserModel.findOneAndUpdate(
      { Username: username },
      { $inc: { LoginCount: -1 } }, // Decrement LoginCount by 1
      { new: true } // Return the updated document
    );

    // Check if the seller was found and updated
    if (!updatedSeller) {
      return res.status(404).json({ error: "Advertiser not found" });
    }

    res.status(200).json({ msg: "Login count decremented", updatedSeller });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const requestDeleteAccountAdvertiser = async (req, res) => {
  try {
      const { Username } = req.body;  
      await DeleteRequestsModel.create({Username : Username,Type: "Advertiser"});
      res.status(200).json({ msg: "You have reqeuested to delete your account, an admin will view your request!" });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

// const allNotificationsRead = async (req, res) => {
//   const { username } = req.query; // Extract username from query
//   try {
//     if (!username) {
//       return res.status(400).json({ error: "Username is required." });
//     }

//     // Find the advertiser and update all notifications to `Read: true`
//     const updatedAdvertiser = await AdvertiserModel.findOneAndUpdate(
//       { Username: username }, // Find the advertiser by username
//       { $set: { "Notifications.$[].Read": true } }, // Update all notifications to `Read: true`
//       { new: true } // Return the updated document
//     );

//     if (!updatedAdvertiser) {
//       return res.status(404).json({ error: "Advertiser not found." });
//     }

//     res.status(200).json({
//       message: "All notifications marked as read successfully.",
//       advertiser: updatedAdvertiser,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

const allNotificationsRead = async (req, res) => {
  const { username } = req.body; // Extract username from the request body
  try {
    if (!username) {
      return res.status(400).json({ error: "Username is required." });
    }

    const updatedAdvertiser = await AdvertiserModel.findOneAndUpdate(
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


const areAllNotificationsRead = async (req, res) => {
  const { username } = req.query; // Extract username from query

  try {
    if (!username) {
      return res.status(400).json({ error: "Username is required." });
    }

    // Find the advertiser by username and select the Notifications field
    const advertiser = await AdvertiserModel.findOne({ Username: username }, "Notifications");

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

const getAdvertiserNotifications = async (req, res) => {
  const { username } = req.query; // Extract username from query parameters

  try {
    if (!username) {
      return res.status(400).json({ error: "Username is required." });
    }

    // Find the advertiser and retrieve the Notifications field
    const advertiser = await AdvertiserModel.findOne(
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

const calculateAdvertiserRevenue = async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: 'Advertiser username is required' });
  }

  try {
    // Step 1: Find all activities created by the advertiser
    const activities = await ActivityModel.find({ AdvertiserName: username });

    if (activities.length === 0) {
      return res.status(404).json({ message: 'No activities found for this advertiser' });
    }

    let totalRevenue = 0;

    // Step 2: Traverse through each activity to calculate revenue
    for (const activity of activities) {
      const activityName = activity.Name;

      // Find all tourists who have booked this activity
      const tourists = await TouristModel.find({
        'BookedActivities.activityName': activityName,
        'BookedActivities.booked': true,
      });

      // Calculate revenue for this activity
      const activityRevenue = tourists.length * activity.Price;
      totalRevenue += activityRevenue;
    }

    // Step 3: Respond with the total revenue
    res.status(200).json({
      advertiserUsername: username,
      totalRevenue,
    });
  } catch (error) {
    console.error('Error calculating revenue:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getUsersWhoBookedActivity = async (req, res) => {
  const { username, name } = req.query;

  if (!username || !name) {
    return res.status(400).json({ error: 'Advertiser username and activity name are required' });
  }

  try {
    // Find the activity created by the given advertiser and matching the name
    const activity = await ActivityModel.findOne({ AdvertiserName: username, Name: name });

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    // Find all tourists who have booked this activity
    const tourists = await TouristModel.find({
      'BookedActivities.activityName': name,
      'BookedActivities.booked': true,
    });

    res.status(200).json({
      activityName: name,
      numberOfUsersBooked: tourists.length,
    });
  } catch (error) {
    console.error('Error fetching booking data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getRevenueFromActivity = async (req, res) => {
  const { username, name } = req.query;

  if (!username || !name) {
    return res.status(400).json({ error: 'Advertiser username and activity name are required' });
  }

  try {
    // Find the activity created by the given advertiser and matching the name
    const activity = await ActivityModel.findOne({ AdvertiserName: username, Name: name });

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    // Find all tourists who have booked this activity
    const tourists = await TouristModel.find({
      'BookedActivities.activityName': name,
      'BookedActivities.booked': true,
    });

    // Calculate total revenue
    const totalRevenue = tourists.length * activity.Price;

    res.status(200).json({
      activityName: name,
      totalRevenue,
    });
  } catch (error) {
    console.error('Error calculating revenue:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



const filterAdvertiserActivities = async (req, res) => {
  const { username, name, date, month } = req.query;

  if (!username) {
    return res.status(400).json({ error: 'Advertiser username is required' });
  }

  try {
    // Build the query dynamically
    const query = { AdvertiserName: username };

    if (name) {
      query.Name = { $regex: name, $options: 'i' }; // Case-insensitive match
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
    const activities = await ActivityModel.find(query);

    if (activities.length === 0) {
      return res.status(404).json({ message: 'No activities found matching the criteria' });
    }

    // Return the filtered activities
    res.status(200).json(activities);
  } catch (error) {
    console.error('Error filtering activities:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getTotalTouristsForAdvertiser = async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: 'Advertiser username is required' });
  }

  try {
    // Step 1: Find all activities created by the advertiser
    const activities = await ActivityModel.find({ AdvertiserName: username });

    if (activities.length === 0) {
      return res.status(404).json({ message: 'No activities found for this advertiser' });
    }

    // Step 2: Get the names of all activities created by this advertiser
    const activityNames = activities.map(activity => activity.Name);

    // Step 3: Count the total number of tourists who booked any of these activities
    const totalTourists = await TouristModel.countDocuments({
      'BookedActivities.activityName': { $in: activityNames },
      'BookedActivities.booked': true,
    });

    res.status(200).json({
      advertiserUsername: username,
      totalTourists,
    });
  } catch (error) {
    console.error('Error fetching tourist count:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getTouristsByActivityAndMonth = async (req, res) => {
  try {
    const { activityName, month } = req.query;

    if (!activityName || !month) {
      return res.status(400).json({ error: 'Activity name and month are required' });
    }

    const monthNumber = parseInt(month) - 1; // Convert to 0-based index

    const tourists = await TouristModel.find({
      'BookedActivities.activityName': activityName,
      'BookedActivities.booked': true,
      'BookedActivities.DateOfBooking': {
        $gte: new Date(new Date().getFullYear(), monthNumber, 1), // Start of the month
        $lt: new Date(new Date().getFullYear(), monthNumber + 1, 1), // Start of the next month
      },
    });

    const count = tourists.length;

    res.status(200).json({ totalTourists: count });
  } catch (error) {
    console.error('Error fetching tourists:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getHighestRevenueActivity = async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: 'Advertiser username is required' });
  }

  try {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const activities = await ActivityModel.find({
      AdvertiserName: username,
      Date: { $gte: monthStart, $lte: monthEnd },
    });

    if (!activities.length) {
      return res.status(404).json({ message: 'No activities found for this advertiser in the current month' });
    }

    let highestRevenueActivity = null;
    let highestRevenue = 0;

    for (const activity of activities) {
      const tourists = await TouristModel.find({
        'BookedActivities.activityName': activity.Name,
        'BookedActivities.booked': true,
        'BookedActivities.DateOfBooking': { $gte: monthStart, $lte: monthEnd },
      });

      const revenue = tourists.length * activity.Price;

      if (revenue > highestRevenue) {
        highestRevenue = revenue;
        highestRevenueActivity = activity.Name;
      }
    }

    res.status(200).json({
      advertiserUsername: username,
      highestRevenueActivity,
      revenue: highestRevenue,
    });
  } catch (error) {
    console.error('Error fetching highest revenue activity:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const calculateCurrentMonthRevenueForAdvertiser = async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: 'Advertiser username is required' });
  }

  try {
    // Step 1: Get the current month and year
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1); // Start of the current month
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0); // End of the current month

    // Step 2: Find all activities created by the advertiser in the current month
    const activities = await ActivityModel.find({
      AdvertiserName: username,
      Date: { $gte: monthStart, $lte: monthEnd }, // Filter activities for the current month
    });

    if (activities.length === 0) {
      return res.status(404).json({ message: 'No activities found for this advertiser in the current month' });
    }

    let totalRevenue = 0;

    // Step 3: Iterate through each activity to calculate revenue
    for (const activity of activities) {
      const bookedActivityName = activity.Name;

      // Find all tourists who booked this activity
      const tourists = await TouristModel.find({
        'BookedActivities.activityName': bookedActivityName,
        'BookedActivities.booked': true,
        'BookedActivities.DateOfBooking': {
          $gte: monthStart,
          $lte: monthEnd, // Filter bookings within the current month
        },
      });

      // Calculate revenue for the activity
      const revenue = tourists.length * activity.Price;
      totalRevenue += revenue; // Add to the total revenue
    }

    // Step 4: Respond with the total revenue
    res.status(200).json({
      advertiserUsername: username,
      totalRevenue,
    });
  } catch (error) {
    console.error('Error calculating revenue for the current month:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const calculateRevenueForAdvertiser = async (req, res) => {
  const { username, date, month } = req.query;

  if (!username || (!date && !month)) {
    return res.status(400).json({ error: 'Advertiser username and either date or month are required.' });
  }

  try {
    // Step 1: Find all activities created by the advertiser
    const activities = await ActivityModel.find({ AdvertiserName: username });

    if (!activities.length) {
      return res.status(404).json({ error: 'No activities found for this advertiser.' });
    }

    // Step 2: Prepare date filters based on input
    let dateFilter = {};
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0); // Start of the day

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999); // End of the day

      dateFilter = {
        'BookedActivities.DateOfBooking': { $gte: startOfDay, $lte: endOfDay },
      };
    } else if (month) {
      const year = new Date().getFullYear(); // Default to current year
      const startOfMonth = new Date(year, month - 1, 1); // Start of the month
      const endOfMonth = new Date(year, month, 0); // End of the month

      dateFilter = {
        'BookedActivities.DateOfBooking': { $gte: startOfMonth, $lte: endOfMonth },
      };
    }

    // Step 3: Find all tourists who booked activities from this advertiser within the date range
    const activityNames = activities.map(activity => activity.Name); // Get all activity names
    const tourists = await TouristModel.find({
      'BookedActivities.activityName': { $in: activityNames },
      'BookedActivities.booked': true,
      ...dateFilter,
    });

    // Step 4: Calculate total revenue
    const revenue = tourists.reduce((total, tourist) => {
      const bookings = tourist.BookedActivities.filter(
        booking => activityNames.includes(booking.activityName) && booking.booked
      );

      const activityRevenue = bookings.reduce((sum, booking) => {
        const activity = activities.find(act => act.Name === booking.activityName);
        return activity ? sum + activity.Price : sum;
      }, 0);

      return total + activityRevenue;
    }, 0);

    // Step 5: Respond with the calculated revenue
    res.status(200).json({
      advertiserUsername: username,
      revenue,
      bookings: tourists.length,
    });
  } catch (error) {
    console.error('Error calculating advertiser revenue:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



      module.exports = {ReadAdvertiserProfile , updateAdvertiser, createNewActivity, readActivity, updateActivity, deleteActivity, getActivitiesByAuthor, loginAdvertiser, updateAdvertiserPassword, decrementLoginCountAdvertiser,requestDeleteAccountAdvertiser, allNotificationsRead, areAllNotificationsRead, getAdvertiserNotifications,calculateAdvertiserRevenue,getUsersWhoBookedActivity,getRevenueFromActivity,filterAdvertiserActivities,getTotalTouristsForAdvertiser,getTouristsByActivityAndMonth,getHighestRevenueActivity,calculateCurrentMonthRevenueForAdvertiser,calculateRevenueForAdvertiser};
