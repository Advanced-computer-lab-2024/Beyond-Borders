const ActivityModel = require('../Models/Activity.js');
const { default: mongoose } = require('mongoose');
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
  
      // Create the new activity
      const newActivity = await ActivityModel.create({AdvertiserName,Name,Date,Time,SpecialDiscount,BookingOpen,
        Price, Rating: 0, Location, Category,Tags, Comments:[], RatingCount: 0});
  
      // Send the created activity as a JSON response with a 200 OK status
      res.status(200).json({ msg: "New activity is created!", activity: newActivity });
      
    } catch (error) {
      // If an error occurs, send a 400 Bad Request status with the error message
      res.status(400).json({ error: error.message });
    }
  };
  const readActivity = async (req, res) => {
    // Destructure the activity name from the request parameters
    const { name } = req.params; // Assuming the name is passed as a route parameter
  
    try {
      // Find the activity by its name (case-insensitive)
      const activity = await ActivityModel.findOne({ Name: { $regex: new RegExp(name, 'i') } });
  
      // If no activity is found, return a 404 error
      if (!activity) {
        return res.status(404).json({ error: "Activity not found!" });
      }
  
      // Return the found activity as a JSON response with a 200 OK status
      res.status(200).json(activity);
      
    } catch (error) {
      // If an error occurs, send a 500 Internal Server Error status with the error message
      res.status(500).json({ error: error.message });
    }
  };

  const updateActivity = async (req, res) => {
    // Destructure the activity name from the request parameters and the new data from the request body
    const { name } = req.params; // Assuming the name is passed as a route parameter
    const { AdvertiserName, Date, Time, SpecialDiscount, BookingOpen, Price, Location, Category, Tags } = req.body;
  
    try {
      // Find the activity by its name (case-insensitive)
      const activity = await ActivityModel.findOne({ Name: { $regex: new RegExp(name, 'i') } });
  
      // If no activity is found, return a 404 error
      if (!activity) {
        return res.status(404).json({ error: "Activity not found!" });
      }
  
      // Update the activity with the new data
      activity.AdvertiserName = AdvertiserName !== undefined ? AdvertiserName : activity.AdvertiserName;
      activity.Date = Date !== undefined ? Date : activity.Date;
      activity.Time = Time !== undefined ? Time : activity.Time;
      activity.SpecialDiscount = SpecialDiscount !== undefined ? SpecialDiscount : activity.SpecialDiscount;
      activity.BookingOpen = BookingOpen !== undefined ? BookingOpen : activity.BookingOpen;
      activity.Price = Price !== undefined ? Price : activity.Price;
      activity.Location = Location !== undefined ? Location : activity.Location;
      activity.Category = Category !== undefined ? Category : activity.Category;
      activity.Tags = Tags !== undefined ? Tags : activity.Tags;
  
      // Save the updated activity
      const updatedActivity = await activity.save();
  
      // Return the updated activity as a JSON response with a 200 OK status
      res.status(200).json(updatedActivity);
  
    } catch (error) {
      // If an error occurs, send a 500 Internal Server Error status with the error message
      res.status(500).json({ error: error.message });
    }
  };
  
  const deleteActivity = async (req, res) => {
    // Destructure the activity name from the request parameters
    const { name } = req.params; // Assuming the name is passed as a route parameter
  
    try {
      // Find the activity by its name (case-insensitive)
      const activity = await ActivityModel.findOneAndDelete({ Name: { $regex: new RegExp(name, 'i') } });
  
      // If no activity is found, return a 404 error
      if (!activity) {
        return res.status(404).json({ error: "Activity not found!" });
      }
  
      // Return a success message upon successful deletion
      res.status(200).json({ message: "Activity deleted successfully." });
  
    } catch (error) {
      // If an error occurs, send a 500 Internal Server Error status with the error message
      res.status(500).json({ error: error.message });
    }
  };

module.exports(createNewActivity,readActivity,updateActivity,deleteActivity);