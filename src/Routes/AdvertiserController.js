const AdvertiserModel = require('../Models/Advertiser.js');
const ActivityModel = require('../Models/Activity.js');
const TagsModel = require('../Models/Tags.js');
const NewActivityCategoryModel = require('../Models/ActivityCategory.js');


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
         const{username} = req.body;
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
     const updateAdvertiser = async (req, res) => {
        const { _id } = req.body;  // Extract the _id from the request body
      
        try {
            if (req.body.Username) {
                delete req.body.Username;
                return res.status(404).json({ msg: "Cannot update username" });
              }
          // Find and update the tourist with the fields provided in req.body
          const updatedAdvertiser = await AdvertiserModel.findByIdAndUpdate(_id, req.body, {
            new: true,            // Return the updated document
            runValidators: true,  // Ensure the updates respect schema validation rules
          });
          res.status(200).json(updatedAdvertiser);
        } catch (error) {
          // Send a 400 error with the error message if something goes wrong
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
            Price,Location,Category,Tags, Rating:0});
      
          // Send the created activity as a JSON response with a 200 OK status
          res.status(200).json({ msg: "New activity is created!"});
          
        } catch (error) {
          // If an error occurs, send a 400 Bad Request status with the error message
          res.status(400).json({ error: error.message });
        }
      };

      const readActivity = async (req, res) => {
        // Destructure fields from the request body
        const {Name} = req.body;
      
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
    
    const deleteActivity = async (req, res) => {
      // Destructure fields from the request body
      const { AdvertiserName, Name} = req.body;
  
      try {
          // Check if the activity exists with the provided name and advertiser name
          const existingActivity = await ActivityModel.findOne({ Name: Name, AdvertiserName: AdvertiserName });
          if (!existingActivity) {
              return res.status(404).json({ error: "Activity not found for the given advertiser." });
          }
          else{
              await ActivityModel.findOneAndDelete({ Name: Name});
          }
      } catch (error) {
          // If an error occurs, send a 400 Bad Request status with the error message
          res.status(400).json({ error: error.message });
      }
  };

  const getActivitiesByAuthor = async (req, res) => {
    try {
      const {AuthorUsername} = req.body;  // Assuming you get the author's ID from the authenticated user
      
      const activities = await ActivityModel.find({ AdvertiserName: AuthorUsername });
  
      if (!activities.length) {
        return res.status(404).json({ error : "You have not created an activities" });
      }
  
      res.status(200).json(activities);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
    

      module.exports = {ReadAdvertiserProfile , updateAdvertiser, createNewActivity, readActivity, updateActivity, deleteActivity, getActivitiesByAuthor};
