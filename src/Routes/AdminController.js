// #Task route solution
const NewAdminModel = require('../Models/Admin.js');
const NewTourismGoverner = require('../Models/TourismGoverner.js');
const NewProduct = require('../Models/Product.js');
const NewUnregisteredSellerModel = require('../Models/UnregisteredSeller.js');
const NewAcceptedSellerModel = require('../Models/AcceptedSeller.js');
const NewActivityCategoryModel = require('../Models/ActivityCategory.js');
const AllUsernamesModel = require('../Models/AllUsernames.js');
const AllTouristModel = require('../Models/Tourist.js');
const TagsModel = require('../Models/Tags.js');
const ActivityModel = require('../Models/Activity.js');
const NewUnregisteredTourGuideModel = require('../Models/UnregisteredTourGuide.js');
const NewAcceptedTourGuideModel = require('../Models/TourGuide.js');
const NewUnregisteredAdvertiserModel = require('../Models/UnregisteredAdvertiser.js');
const NewAcceptedAdvertiserModel = require('../Models/Advertiser.js');

const NewUnregisteredTransportationAdvertiserModel = require('../Models/UnregisteredTranspAdvertiser.js');
const NewAcceptedTransportationAdvertiserModel = require('../Models/TransportationAdvertiser.js');

const ItineraryrModel = require('../Models/Itinerary.js');
const ComplaintsModel = require('../Models/Complaints.js');
const ArchivedProductsModel = require('../Models/ArchivedProducts.js');
const DeleteRequestsModel = require('../Models/DeleteRequests.js');
const DeactivatedItineraries = require('../Models/DeactivatedItineraries.js');
const DeactivatedActivitiesModel = require('../Models/DeactivatedActivities.js');
const PromoCode = require('../Models/PromoCode'); 
const Order = require('../Models/Orders.js');
const nodemailer = require('nodemailer'); 

const { default: mongoose } = require('mongoose');
const path = require('path');
const fs = require('fs');

const createNewAdmin = async(req,res) => {
   //Destructure Name, Email, Age from the request body
   const{Username,Password} = req.body;
   try{
      // Check if a user with the same Username already exists
      const existingUser = await AllUsernamesModel.findOne({Username});
      if (existingUser) {
          return res.status(400).json({ error: "Username already exists!" });
      }
      else{
         await AllUsernamesModel.create({Username});
         //add a new user to the database with Name, Email and Age
         const user = await NewAdminModel.create({Username,Password});
         //Send the created use as a JSON response with a 200 OK status 
         res.status(200).json({msg:"New admin is created!"});
         //res.status(200).json(user);
      }
   } catch (error){
      //If an error occurs, send a 400 Bad Request status with the error message
      res.status(400).json({ error: error.message});
   }
}

const createNewTourismGoverner = async(req,res) => {
    //Destructure Name, Email, Age from the request body
    const{Username,Password} = req.body;
    try{
        // Check if a user with the same Username already exists
        const existingUser = await AllUsernamesModel.findOne({ Username });
        if (existingUser) {
            return res.status(400).json({ error: "Username already exists!" });
        }
        else{
         await AllUsernamesModel.create({Username});
         //add a new user to the database with Name, Email and Age
         const user = await NewTourismGoverner.create({Username,Password});
         //Send the created use as a JSON response with a 200 OK status 
         res.status(200).json({msg:"New Tourism Governer is created!"});
         //res.status(200).json(user);
        }
    } catch (error){
       //If an error occurs, send a 400 Bad Request status with the error message
       res.status(400).json({ error: error.message});
    }
 }

//  const createNewProduct = async(req,res) => {
//    //Destructure Name, Email, Age from the request body
//    const{Name,Description,Price,Quantity, Seller,Picture} = req.body;
//    try{
//       const existingSeller = await NewAcceptedSellerModel.findOne({ Username: Seller });
//        if (existingSeller) {
//          //add a new user to the database with Name, Email and Age
//          const user = await NewProduct.create({Name,Description,Price,Quantity, Seller,Picture, Reviews: "",Ratings: 0,Sales: 0,TotalPriceOfSales: 0});
//          //Send the created use as a JSON response with a 200 OK status 
//          res.status(200).json({msg:"New Product is created!"});
//          //res.status(200).json(user);
//        }
//       else{
//          res.status(400).json({msg:"This seller does not exist!"});
//       }
//    } catch (error){
//       //If an error occurs, send a 400 Bad Request status with the error message
//       res.status(400).json({ error: error.message});
//    }
// }

const createNewProduct = async (req, res) => {
    const { Name, Description, Price, Quantity, Seller } = req.body;
    try {
      if (!Name || !Description || !Price || !Quantity || !Seller || !req.file) {
        return res.status(400).json({ error: "All fields are required" });
      }
  
      const existingSeller = await NewAcceptedSellerModel.findOne({ Username: Seller });
      if (!existingSeller) {
        return res.status(400).json({ error: "Seller does not exist" });
      }
  
      const newProduct = await NewProduct.create({
        Name,
        Description,
        Price,
        Quantity,
        Seller,
        Picture: `/uploads/${req.file.filename}`, // Save the file path
        Reviews: [],
        Ratings: 0,
        Sales: 0,
        TotalPriceOfSales: 0,
      });
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

  const editProduct = async (req, res) => {
    try {
      const { Name, Price, Quantity, Description } = req.body;
  
      if (!Name) {
        return res.status(400).json({ message: 'Product name is required' });
      }
  
      // Find the product by name
      const product = await NewProduct.findOne({ Name: Name.trim() });
  
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      // Prepare updated fields
      const updateFields = { Price, Quantity, Description };
  
      // Replace the picture if a new one is uploaded
      if (req.file) {
        const oldPicturePath = path.join(__dirname, '..', product.Picture);
        if (fs.existsSync(oldPicturePath)) {
          fs.unlinkSync(oldPicturePath); // Delete the old file
        }
        updateFields.Picture = `/uploads/${req.file.filename}`;
      }
  
      // Update the product in the database
      const updatedProduct = await NewProduct.findOneAndUpdate(
        { Name },
        { $set: updateFields },
        { new: true }
      );
  
      res.status(200).json(updatedProduct);
    } catch (error) {
      console.error('Error editing product:', error);
      res.status(500).json({ message: 'Failed to edit product', error });
    }
  };
  
  

const acceptSeller = async (req, res) => {
   const {SellerUsername} = req.body;

   try {
       // Find the unregistered seller by ID
       const existingUser = await NewUnregisteredSellerModel.findOne({Username : SellerUsername});
       
       if (existingUser) {
           // Create a new accepted seller with the existing user's details
           const { Username, Email, Password, Name, Description} = existingUser; // Destructure the relevant fields
           const createdSeller = await NewAcceptedSellerModel.create({Username,Email,Password,Name,Description});
           // Delete the unregistered seller
           await NewUnregisteredSellerModel.findOneAndDelete({Username : SellerUsername});
           // Respond with success message
           res.status(200).json({ msg: "Seller has been accepted!" });
       } else {
           res.status(404).json({ error: "Unregistered seller not found." });
       }
   } catch (error) {
       // Handle any errors that occur during the process
       res.status(400).json({ error: error.message });
   }
};

const acceptTourGuide = async (req, res) => {
    const {TourGuideUsername} = req.body;
 
    try {
        // Find the unregistered seller by ID
        const existingUser = await NewUnregisteredTourGuideModel.findOne({Username: TourGuideUsername});
        
        if (existingUser) {
            // Create a new accepted seller with the existing user's details
            const { Username, Email, Password, MobileNum, YearsOfExperience, PreviousWork} = existingUser; // Destructure the relevant fields
            const createdSeller = await NewAcceptedTourGuideModel.create({Username, Email, Password, MobileNum, YearsOfExperience, PreviousWork, Notifications:[]});
            // Delete the unregistered seller
            await NewUnregisteredTourGuideModel.findOneAndDelete({Username: TourGuideUsername});
            // Respond with success message
            res.status(200).json({ msg: "TourGuide has been accepted!" });
        } else {
            res.status(404).json({ error: "Unregistered TourGuide not found." });
        }
    } catch (error) {
        // Handle any errors that occur during the process
        res.status(400).json({ error: error.message });
    }
 };

 const acceptAdvertiser = async (req, res) => {
    const {AdvertiserUsername} = req.body;
 
    try {
        // Find the unregistered seller by ID
        const existingUser = await NewUnregisteredAdvertiserModel.findOne({Username: AdvertiserUsername});
        
        if (existingUser) {
            // Create a new accepted seller with the existing user's details
            const {Username,Email,Password,Website,Hotline,CompanyProfile} = existingUser; // Destructure the relevant fields
            const createdSeller = await NewAcceptedAdvertiserModel.create({Username,Email,Password,Website,Hotline,CompanyProfile, Notifications:[]});
            // Delete the unregistered seller
            await NewUnregisteredAdvertiserModel.findOneAndDelete({Username: AdvertiserUsername});
            // Respond with success message
            res.status(200).json({ msg: "Advertiser has been accepted!" });
        } else {
            res.status(404).json({ error: "Unregistered Advertiser not found." });
        }
    } catch (error) {
        // Handle any errors that occur during the process
        res.status(400).json({ error: error.message });
    }
 };

 const acceptTranspAdvertiser = async (req, res) => {
    const {AdvertiserUsername} = req.body;
 
    try {
        // Find the unregistered seller by ID
        const existingUser = await NewUnregisteredTransportationAdvertiserModel.findOne({Username: AdvertiserUsername});
        
        if (existingUser) {
            // Create a new accepted seller with the existing user's details
            const {Username,Email,Password,CompanyName,Website,Hotline,CompanyProfile} = existingUser; 
            const createdSeller = await NewAcceptedTransportationAdvertiserModel.create({Username,Email,Password,CompanyName,Website,Hotline,CompanyProfile});
            // Delete the unregistered seller
            await NewUnregisteredTransportationAdvertiserModel.findOneAndDelete({Username: AdvertiserUsername});
            // Respond with success message
            res.status(200).json({ msg: "Transportation Advertiser has been accepted!" });
        } else {
            res.status(404).json({ error: "Unregistered Transportation Advertiser not found." });
        }
    } catch (error) {
        // Handle any errors that occur during the process
        res.status(400).json({ error: error.message });
    }
 };


 const rejectSeller = async (req, res) => {
    const { SellerUsername } = req.body;
 
    if (!SellerUsername) {
        return res.status(400).json({ error: "SellerUsername is required." });
    }
 
    try {
        // Find the unregistered seller by Username
        const existingUser = await NewUnregisteredSellerModel.findOne({ Username: SellerUsername });
 
        if (existingUser) {
            // Extract Username
            const { Username } = existingUser;
 
            // Delete from AllUsernamesModel
            await AllUsernamesModel.findOneAndDelete({ Username });
 
            // Delete the unregistered seller
            await NewUnregisteredSellerModel.findOneAndDelete({ Username: SellerUsername });
 
            // Respond with success message
            res.status(200).json({ msg: "Seller has been rejected!" });
        } else {
            res.status(404).json({ error: "Unregistered seller not found." });
        }
    } catch (error) {
        // Handle any errors that occur during the process
        console.error("Error rejecting seller:", error.message);
        res.status(400).json({ error: error.message });
    }
 };
 

const rejectTourGuide = async (req, res) => {
    const {TourGuideUsername} = req.body;
 
    try {
        // Find the unregistered seller by ID
        const existingUser = await NewUnregisteredTourGuideModel.findOne({Username: TourGuideUsername});
        
        if (existingUser) {
             // Extract Username
             const {Username} = existingUser;
             await AllUsernamesModel.findOneAndDelete({Username});
            // Delete the unregistered seller
            await NewUnregisteredTourGuideModel.findOneAndDelete({Username: TourGuideUsername});
            // Respond with success message
            res.status(200).json({ msg: "Tour Guide has been rejected!" });
        } else {
            res.status(404).json({ error: "Tour Guide not found." });
        }
    } catch (error) {
        // Handle any errors that occur during the process
        res.status(400).json({ error: error.message });
    }
 };

 const rejectAdvertiser = async (req, res) => {
    const {AdvertiserUsername} = req.body;
 
    try {
        // Find the unregistered seller by ID
        const existingUser = await NewUnregisteredAdvertiserModel.findOne({Username: AdvertiserUsername});
        
        if (existingUser) {
             // Extract Username
             const {Username} = existingUser;
             await AllUsernamesModel.findOneAndDelete({Username});
            // Delete the unregistered seller
            await NewUnregisteredAdvertiserModel.findOneAndDelete({Username: AdvertiserUsername});
            // Respond with success message
            res.status(200).json({ msg: "Advertiser has been rejected!" });
        } else {
            res.status(404).json({ error: "Advertiser not found." });
        }
    } catch (error) {
        // Handle any errors that occur during the process
        res.status(400).json({ error: error.message });
    }
 };

 const rejectTranspAdvertiser = async (req, res) => {
    const {AdvertiserUsername} = req.body;
 
    try {
        // Find the unregistered seller by ID
        const existingUser = await NewUnregisteredTransportationAdvertiserModel.findOne({Username: AdvertiserUsername});
        
        if (existingUser) {
             // Extract Username
             const {Username} = existingUser;
             await AllUsernamesModel.findOneAndDelete({Username});
            // Delete the unregistered seller
            await NewUnregisteredTransportationAdvertiserModel.findOneAndDelete({Username: AdvertiserUsername});
            // Respond with success message
            res.status(200).json({ msg: "Transportation Advertiser has been rejected!" });
        } else {
            res.status(404).json({ error: "Transportation Advertiser not found." });
        }
    } catch (error) {
        // Handle any errors that occur during the process
        res.status(400).json({ error: error.message });
    }
 };

const createNewCategory = async(req,res) => {
   //Destructure Name, Email, Age from the request body
   const{NameOfCategory} = req.body;
   try{
      // Check if a user with the same Username already exists
      const existingCategory = await NewActivityCategoryModel.findOne({NameOfCategory});
      if (existingCategory) {
          return res.status(400).json({ error: "Category already exists!" });
      }
      //add a new category to the database with Name, Email and Age
      const category = await NewActivityCategoryModel.create({NameOfCategory});
      //Send the created use as a JSON response with a 200 OK status 
      res.status(200).json({msg:"New Category is created!"});
      //res.status(200).json(user);
   } catch (error){
      //If an error occurs, send a 400 Bad Request status with the error message
      res.status(400).json({ error: error.message});
   }
}

const createNewTag = async(req,res) => {
   //Destructure Name, Email, Age from the request body
   const{NameOfTags} = req.body;
   try{
      // Check if a user with the same Username already exists
      const existingTag = await TagsModel.findOne({NameOfTags});
      if (existingTag) {
          return res.status(400).json({ error: "Tag already exists!" });
      }
      //add a new category to the database with Name, Email and Age
      const newTag = await TagsModel.create({NameOfTags});
      //Send the created use as a JSON response with a 200 OK status 
      res.status(200).json({msg:"New Tag is created!"});
      //res.status(200).json(user);
   } catch (error){
      //If an error occurs, send a 400 Bad Request status with the error message
      res.status(400).json({ error: error.message});
   }
}

const readAllActivityCategories = async (req, res) => {
   try {
       const categories = await NewActivityCategoryModel.find(); //Fetch all categories
       res.status(200).json(categories);
   } catch (error) {
       res.status(400).json({ error: error.message }); 
   }
};

const readAllTags = async (req, res) => {
   try {
       const tags = await TagsModel.find(); //Fetch all categories
       res.status(200).json(tags);
   } catch (error) {
       res.status(400).json({ error: error.message }); 
   }
};

const updateCategory = async (req, res) => {
   const {oldCategoryName,newCategoryName} = req.body;
   try {
    // Check if the new category name already exists
    const existingCategory = await NewActivityCategoryModel.findOne({ NameOfCategory: newCategoryName });
    if (existingCategory) {
        return res.status(400).json({ error: "Category name already exists." });
    }
       // Find the category by the old name and update it
       const updatedCategory = await NewActivityCategoryModel.findOneAndUpdate(
           {NameOfCategory: oldCategoryName}, //Find the category with the old name 
           {NameOfCategory: newCategoryName}, //Update the category name
           {new: true} // Return the updated document
       );
       if (!updatedCategory) {
           return res.status(404).json({ error: "Category not found." }); // Handle case where category does not exist
       }
       // Update the Category field in all Activities that have this old category name
       await ActivityModel.updateMany(
         { Category: oldCategoryName }, // Find activities with the old category
         { Category: newCategoryName } // Update the category to the new name
     );
       res.status(200).json(updatedCategory);
   } catch (error) {
       res.status(400).json({ error: error.message });
   }
};

// const updateTag = async (req, res) => {
//    const {oldTagName,newTagName} = req.body;
//    try {
//        // Find the category by the old name and update it
//        const updatedTag = await TagsModel.findOneAndUpdate(
//            {NameOfTags: oldTagName}, //Find the category with the old name 
//            {NameOfTags: newTagName}, //Update the category name
//            {new: true} // Return the updated document
//        );
//        if (!updatedTag) {
//            return res.status(404).json({ error: "Tag not found." }); // Handle case where category does not exist
//        }
//        await ActivityModel.updateMany(
//          { NameOfTags: oldTagName }, // Find activities that have the old tag
//          { $set: { NameOfTags: { $map: { input: "$Tags", as: "tag", in: { $cond: { if: { $eq: ["$$tag", oldTagName] }, then: newTagName, else: "$$tag" } } } } } } // Replace old tag with new tag
//      );
//        res.status(200).json(updatedTag);
//    } catch (error) {
//        res.status(400).json({ error: error.message });
//    }
// };

const updateTag = async (req, res) => {
    const { oldTagName, newTagName } = req.body;
    
    try {
        const existingTag = await TagsModel.findOne({ NameOfTags: newTagName });
        if (existingTag) {
            return res.status(400).json({ error: "Tag name already exists." });
        }
        // Step 1: Update the tag in the TagsModel
        const updatedTag = await TagsModel.findOneAndUpdate(
            { NameOfTags: oldTagName },
            { NameOfTags: newTagName },
            { new: true }
        );

        if (!updatedTag) {
            return res.status(404).json({ error: "Tag not found." });
        }

        // Step 2: Update activities that have the old tag
        const activities = await ActivityModel.find({ Tags: oldTagName });

        // Loop through each activity and update the Tags array
        for (const activity of activities) {
            const updatedTags = activity.Tags.map(tag =>
                tag === oldTagName ? newTagName : tag
            );

            // Save the updated activity
            await ActivityModel.findByIdAndUpdate(activity._id, { Tags: updatedTags });
        }

        // Step 3: Update itineraries that have the old tag
        const itineraries = await ItineraryrModel.find({ Tags: oldTagName });

        // Loop through each activity and update the Tags array
        for (const itinerary1 of itineraries) {
            const updatedTags1 = itinerary1.Tags.map(tag =>
                tag === oldTagName ? newTagName : tag
            );

            // Save the updated activity
            await ItineraryrModel.findByIdAndUpdate(itinerary1._id, { Tags: updatedTags1 });
        }

        res.status(200).json({ msg: "Tag and related activities updated successfully." });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const deleteActivityCategory = async (req, res) => {
    const { CategoryName } = req.body;

    try {
        const category = await NewActivityCategoryModel.findOne({ NameOfCategory: CategoryName });
        if (!category) {
            return res.status(404).json({ error: "Category not found." });
        }
        await NewActivityCategoryModel.findOneAndDelete({ NameOfCategory: CategoryName });
        await ActivityModel.deleteMany({ Category: CategoryName }); // Delete activities with this category

        res.status(200).json({ msg: "Category has been deleted and associated activities removed!" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const deleteTag = async (req, res) => {
    const { TagName } = req.body;

    try {
        // Step 1: Check if the tag exists
        const tag = await TagsModel.findOne({ NameOfTags: TagName });
        if (!tag) {
            return res.status(404).json({ error: "Tag not found." });
        }

        // Step 2: Delete the tag from TagsModel
        await TagsModel.findOneAndDelete({ NameOfTags: TagName });

        // Step 3: Update activities to remove the deleted tag
        await ActivityModel.updateMany(
            { Tags: TagName }, // Find activities that have the tag
            { $pull: { Tags: TagName } } // Remove the tag from the Tags array
        );

        // Step 3: Update activities to remove the deleted tag
        await ItineraryrModel.updateMany(
            { Tags: TagName }, // Find activities that have the tag
            { $pull: { Tags: TagName } } // Remove the tag from the Tags array
        );

        res.status(200).json({ msg: "Tag has been deleted and removed from activities!" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deactivateItinerary = async ({ body }) => {
    const { title } = body; // Get the title from the request body

    try {
        const itinerary = await ItineraryrModel.findOne({ Title: title });
        if (!itinerary) {
            return { status: 404, message: "Itinerary not found!" };
        }

        // Create a new deactivated itinerary document from the found itinerary
        const deactivatedItinerary = new DeactivatedItineraries({
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
        await ItineraryrModel.deleteOne({ Title: title });

        // Return status and message
        return { status: 200, message: "Itinerary has been deactivated!" };
    } catch (error) {
        return { status: 500, message: error.message };
    }
};


const deactivateActivity = async ({ body }) => {
    const { name } = body;  // Get the name (or any unique identifier) from the request body

    try {
        const activity = await ActivityModel.findOne({ Name: name });
        
        if (!activity) {
            return { status: 404, message: "Activity not found!" };
        }

        // Create a new deactivated activity document from the found activity
        const deactivatedActivity = new DeactivatedActivitiesModel({
            AdvertiserName: activity.AdvertiserName,
            Name: activity.Name,
            Date: activity.Date,
            Time: activity.Time,
            SpecialDiscount: activity.SpecialDiscount,
            BookingOpen: activity.BookingOpen,
            isBooked: activity.isBooked,
            Price: activity.Price,
            Rating: activity.Rating,
            Location: activity.Location,
            Category: activity.Category,
            Tags: activity.Tags,
            Comments: activity.Comments,
            RatingCount: activity.RatingCount,
            flagged: activity.flagged
        });

        // Save the new deactivated activity
        await deactivatedActivity.save();

        // Delete the original activity from the active collection
        await ActivityModel.deleteOne({ Name: name });

        // Return status and message
        return { status: 200, message: "Activity has been deactivated!" };
    } catch (error) {
        return { status: 500, message: error.message };
    }
};


const deleteAccount = async (req, res) => {
    const { username } = req.body;

    let responseSent = false;

    try {
        // Find the unregistered seller by ID
        const existingUser = await AllUsernamesModel.findOne({ Username: username });

        if (existingUser) {
            // Delete username from AllUsernames Model
            await AllUsernamesModel.findOneAndDelete({ Username: username });
            await DeleteRequestsModel.findOneAndDelete({ Username: username });

            const existingTourist = await AllTouristModel.findOne({ Username: username });
            const existingTourGuide = await NewAcceptedTourGuideModel.findOne({ Username: username });
            const existingSeller = await NewAcceptedSellerModel.findOne({ Username: username });
            const existingAdvertiser = await NewAcceptedAdvertiserModel.findOne({ Username: username });

            if (existingTourist) {
                await AllTouristModel.findOneAndDelete({ Username: username });
            } 
            else if (existingSeller) {
                await NewProduct.deleteMany({ Seller: username });
                await NewAcceptedSellerModel.findOneAndDelete({ Username: username });
            } 
            else if (existingTourGuide) {
                const itineraries = await ItineraryrModel.find({ AuthorUsername: username });
                for (let itinerary of itineraries) {
                    // Deactivate the itinerary and handle the result
                    const result = await deactivateItinerary({ body: { title: itinerary.Title } });
                    if (!responseSent) {
                        res.status(result.status).json({ msg: result.message });
                        responseSent = true;
                    }
                }
                await NewAcceptedTourGuideModel.findOneAndDelete({ Username: username });
            } 
            else if (existingAdvertiser) {
                const activities = await ActivityModel.find({ AdvertiserName: username });
                for (let activity of activities) {
                    // Deactivate the activity and handle the result
                    const result = await deactivateActivity({ body: { name: activity.Name } });
                    if (!responseSent) {
                        res.status(result.status).json({ msg: result.message });
                        responseSent = true;
                    }
                }
                await NewAcceptedAdvertiserModel.findOneAndDelete({ Username: username });
            } 
            else {
                if (!responseSent) {
                    res.status(404).json({ error: "Account with this username does not exist." });
                    responseSent = true;
                }
            }

            // Respond with success message only once
            if (!responseSent) {
                res.status(200).json({ msg: "Account has been deleted!" });
                responseSent = true;
            }
        } else {
            if (!responseSent) {
                res.status(404).json({ error: "Account with this username does not exist." });
                responseSent = true;
            }
        }
    } catch (error) {
        // Handle any errors that occur during the process
        if (!responseSent) {
            res.status(400).json({ error: error.message });
            responseSent = true;
        }
    }
};






const searchProductAdmin = async (req, res) => {
   const {ProductName} = req.body;
   try {
       const fetchedProduct = await NewProduct.findOne({Name: ProductName}); //Fetch all categories
       res.status(200).json(fetchedProduct);
   } catch (error) {
      res.status(200).json({ msg: "There is no product with this name!" });
   }
};

// const createNewActivity = async (req, res) => {
//    // Destructure fields from the request body
//    const { AdvertiserName, Name, Date, Time, SpecialDiscount, BookingOpen, Price, Location, Category, Tags } = req.body;
 
//    try {
//      // Check if the category exists
//      const existingCategory = await NewActivityCategoryModel.findOne({ NameOfCategory: Category });
//      if (!existingCategory) {
//        return res.status(400).json({ error: "Selected category does not exist!" });
//      }
 
//      // Check if all provided tags exist
//      const existingTags = await TagsModel.find({ NameOfTags: { $in: Tags } });
//      if (existingTags.length !== Tags.length) {
//        return res.status(400).json({ error: "One or more tags do not exist!" });
//      }
 
//      // Create the new activity
//      const newActivity = await ActivityModel.create({AdvertiserName,Name,Date,Time,SpecialDiscount,BookingOpen,
//        Price,Location,Category,Tags});
 
//      // Send the created activity as a JSON response with a 200 OK status
//      res.status(200).json({ msg: "New activity is created!", activity: newActivity });
     
//    } catch (error) {
//      // If an error occurs, send a 400 Bad Request status with the error message
//      res.status(400).json({ error: error.message });
//    }
//  };

const filterProductByPriceAdmin = async (req, res) => {
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
          const fetchedProducts = await NewProduct.find({
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
 
  const sortProductsDescendingAdmin = async (req, res) => {
    try {
        // Fetch products sorted by ratings in descending order
        const products = await NewProduct.find().sort({ Ratings: -1 });

        // Respond with the sorted products
        res.status(200).json(products);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const sortProductsAscendingAdmin = async (req, res) => {
    try {
        // Fetch products sorted by ratings in ascending order
        const products = await NewProduct.find().sort({ Ratings: 1 });

        // Respond with the sorted products
        res.status(200).json(products);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const viewProducts = async (req, res) => {
    try {
      const {Name} = req.body;  
      
      const products = await NewProduct.find({ Name: Name });
  
      if (!products.length) {
        return res.status(404).json({ error : "There is no product with this name" });
      }
  
      res.status(200).json(products);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  const loginAdmin = async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Validate input
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required." });
      }
  
      // Find the advertiser by username
      const admin = await NewAdminModel.findOne({ Username: username });
      if (!admin) {
        return res.status(401).json({ error: "Invalid username." });
      }
  
      // Check if the password matches
      if (admin.Password !== password) {
        return res.status(401).json({ error: "Invalid password." });
      }
  
      // Successful authentication
      res.status(200).json({ message: "Login successful!", admin });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  const viewAllProductsAdmin = async (req, res) => {
    try {
        const products = await NewProduct.find({}).sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const viewAllActivitiesAdmin = async (req, res) => {
    try {
        const activities = await ActivityModel.find({}).sort({ createdAt: -1 });
        res.status(200).json(activities);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const viewAllItinerariesAdmin = async (req, res) => {
    try {
        const itineraries = await ItineraryrModel.find({}).sort({ createdAt: -1 });
        res.status(200).json(itineraries);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
const viewArchivedProductsAdmin = async (req, res) => {
    try {
        const products = await ArchivedProductsModel.find({}).sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateAdminPassword = async (req, res) => {
    const { Username, newPassword } = req.body;

    try {
        const existingUser = await NewAdminModel.findOne({ Username:Username });

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

const getAllComplaints = async (req, res) => {
    try {
        const complaints = await ComplaintsModel.find();
        res.status(200).json(complaints);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateComplaintStatus = async (req, res) => {
    const { Title, newStatus } = req.body;

    try {
        const complaint = await ComplaintsModel.findOne({ Title:Title });

        //Redundant for extra safety
        if (!complaint) {
            return res.status(404).json({ error: "Complaint not found!" });
        }
        complaint.Status = newStatus;
        await complaint.save();
        res.status(200).json({ msg: "Complaint status updated successfully!", complaint });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const replyToComplaint = async (req, res) => {
    const { Title, Reply } = req.body;

    try {
        const complaint = await ComplaintsModel.findOne({ Title:Title });

        //Redundant
        if (!complaint) {
            return res.status(404).json({ error: "Complaint not found!" });
        }
        complaint.Reply = Reply;
        await complaint.save();
        res.status(200).json({ msg: "Complaint reply updated successfully!", complaint });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//THE FOLLOWING FUCTION COULD BE IMPLEMENTED IN THE FRONTEND WITHOUT USING THIS METHOD
const getComplaintDetails = async (req, res) => {
    const { Title } = req.body; 

    try {
        const complaint = await ComplaintsModel.findOne({ Title : Title});
        if (!complaint) {
            return res.status(404).json({ error: "Complaint not found!" });
        }
        res.status(200).json(complaint);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// const filterComplaintsByStatus = async (req, res) => {
//     const { Status } = req.body; // Get the status from the query parameters

//     try {
//         if (!Status) {
//             return res.status(400).json({ error: "Status is required!" });
//         }
//         const complaints = await ComplaintsModel.find({ Status: Status });
//         if (complaints.length === 0) {
//             return res.status(404).json({ error: "No complaints found with this status!" });
//         }
//         res.status(200).json(complaints);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };

const filterComplaintsByStatus = async (req, res) => {
    const { Status } = req.body; // Extract status from the request body
    const query = {}; // Initialize an empty query object

    try {
        // Check if Status is provided and add it to the query if so
        if (Status) {
            query.Status = Status;
        } else {
            return res.status(400).json({ error: "Status is required!" });
        }

        // Fetch complaints based on the constructed query
        const complaints = await ComplaintsModel.find(query);
        if (complaints.length === 0) {
            return res.status(404).json({ error: "No complaints found with this status!" });
        }
        res.status(200).json(complaints);
    } catch (error) {
        console.error('Error fetching complaints:', error);
        res.status(500).json({ error: "An error occurred while fetching complaints." });
    }
};

const sortComplaintsByRecent = async (req, res) => {
    try {
        // Find all complaints and sort by Date in descending order
        const complaints = await ComplaintsModel.find().sort({ Date: -1 }); // -1 for descending
        res.status(200).json(complaints);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Function to get complaints sorted by oldest to most recent
const sortComplaintsByOldest = async (req, res) => {
    try {
        // Find all complaints and sort by Date in ascending order
        const complaints = await ComplaintsModel.find().sort({ Date: 1 }); // 1 for ascending
        res.status(200).json(complaints);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// const archiveProduct = async (req, res) => {
//     try {
//         const { ProductID } = req.body;  
//         const archivedProduct = await NewProduct.findById(ProductID);
//         const{Name,Description,Price,Quantity, Seller,Picture, Reviews, Ratings,RatingCount} = archivedProduct; // Destructure the relevant fields
//         const createArchivedProduct = await ArchivedProductsModel.create({Name: Name,Description:Description,Price:Price,Quantity:Quantity, Seller:Seller,Picture:Picture, Reviews:Reviews, Ratings:Ratings,RatingCount:RatingCount});
//         await NewProduct.findByIdAndDelete(ProductID);
//         res.status(200).json({ msg: "Product has been archived!" });
//     } catch (error) {
//         // Handle any errors that occur during the process
//         res.status(500).json({ error: error.message });
//     }
// };

const archiveProduct = async (req, res) => {
    try {
        const { ProductID } = req.body;  
        // Find the product by ID
        const archivedProduct = await NewProduct.findById(ProductID);
        if (!archivedProduct) {
            return res.status(404).json({ error: "Product not found!" });
        }
        // Destructure fields with default values for optional fields
        const { Name, Description, Price, Quantity, Seller, Picture, Reviews = [],Ratings, RatingCount, Sales,TotalPriceOfSales } = archivedProduct;

        // Ensure Reviews has the correct structure
        const validatedReviews = Array.isArray(Reviews)
            ? Reviews.map(review => ({
                touristUsername: review.touristUsername || "",
                Review: review.Review || ""
              }))
            : []; // If not an array, default to empty array

        // Create a new archived product entry
        const createArchivedProduct = await ArchivedProductsModel.create({
            Name,
            Description,
            Price,
            Quantity,
            Seller,
            Picture,
            Reviews: validatedReviews,
            Ratings,
            RatingCount,
            Sales,
            TotalPriceOfSales
        });

        // Delete the product from NewProduct collection
        await NewProduct.findByIdAndDelete(ProductID);

        res.status(200).json({ msg: "Product has been archived!" });
    } catch (error) {
        // Handle any errors that occur during the process
        res.status(500).json({ error: error.message });
    }
};

const unarchiveProduct = async (req, res) => {
    try {
        const { ProductID } = req.body;  
        
        // Find the product by ID in the ArchivedProductsModel
        const archivedProduct = await ArchivedProductsModel.findById(ProductID);
        if (!archivedProduct) {
            return res.status(404).json({ error: "Archived product not found!" });
        }
        
        // Destructure fields with default values for optional fields
        const { 
            Name, 
            Description, 
            Price, 
            Quantity, 
            Seller, 
            Picture, 
            Reviews = [], 
            Ratings, 
            RatingCount,
            Sales,
            TotalPriceOfSales 
        } = archivedProduct;

        // Ensure Reviews has the correct structure
        const validatedReviews = Array.isArray(Reviews)
            ? Reviews.map(review => ({
                touristUsername: review.touristUsername || "",
                Review: review.Review || ""
              }))
            : []; // If not an array, default to empty array

        // Recreate the product in NewProduct collection
        const recreateProduct = await NewProduct.create({
            Name,
            Description,
            Price,
            Quantity,
            Seller,
            Picture,
            Reviews: validatedReviews,
            Ratings,
            RatingCount,
            Sales,
            TotalPriceOfSales
        });

        // Delete the product from ArchivedProductsModel
        await ArchivedProductsModel.findByIdAndDelete(ProductID);

        res.status(200).json({ msg: "Product has been unarchived!" });
    } catch (error) {
        // Handle any errors that occur during the process
        res.status(500).json({ error: error.message });
    }
};

const flagItinerary = async (req, res) => {
    try {
      const { title } = req.body;
      const itinerary = await ItineraryrModel.findOneAndUpdate(
        { Title: title },
        { flagged: true },
        { new: true }
      );
  
      if (!itinerary) {
        return res.status(404).json({ error: "Itinerary not found!" });
      }
  
      res.status(200).json({ message: "Itinerary has been flagged successfully!", itinerary });
      const tourguide = await NewAcceptedTourGuideModel.findOne({Username: itinerary.AuthorUsername});
      sendFlagItineraryEmail(tourguide.Email, title);
      sendFlagItineraryNotification(tourguide.Username, title);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  async function sendFlagItineraryEmail(email, itineraryName) {
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
      subject: 'Itinerary has been flagged!',
      text: `Your itinerary titled "${itineraryName}" has been flagged as inapppropriate by our admins! As a result it  is no longer visible to any tourists/guests.`
    };
  
    await transporter.sendMail(mailOptions);
  }
  
  async function sendFlagItineraryNotification(username, itineraryName) {
    try {
      const notificationText = `Your itinerary titled "${itineraryName}" has been flagged as inappropriate by our admins! As a result, it is no longer visible to any tourists/guests.`;
      const updatedTourGuide = await NewAcceptedTourGuideModel.findOneAndUpdate(
        { Username: username }, // Find the advertiser by username
        {
          $push: { 
            Notifications: { 
              NotificationText: notificationText, 
              Read: false // Default to unread
            }
          }
        },
        { new: true } // Return the updated document
      );
  
      // Check if the advertiser was found
      if (!updatedTourGuide) {
        console.error(`TourGuide with username "${username}" not found.`);
        return;
      }
  
      console.log(`Notification added to tourguide "${username}" successfully.`);
    } catch (error) {
      console.error(`Error adding notification: ${error.message}`);
    }
  }

  const flagActivity = async (req, res) => {
    try {
      const { title } = req.body;
      const activity = await ActivityModel.findOneAndUpdate(
        { Name: title },
        { flagged: true },
        { new: true }
      );
  
      if (!activity) {
        return res.status(404).json({ error: "Activity not found!" });
      }
  
      res.status(200).json({ message: "Activity has been flagged successfully!", activity });
      const advertiser = await NewAcceptedAdvertiserModel.findOne({Username: activity.AdvertiserName});
      sendFlagActivityEmail(advertiser.Email, title);
      sendFlagAvtivityNotification(advertiser.Username, title);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  async function sendFlagActivityEmail(email, activityName) {
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
      subject: 'Activity has been flagged!',
      text: `Your activity titled "${activityName}" has been flagged as inapppropriate by our admins! As a result it  is no longer visible to any tourists/guests.`
    };
  
    await transporter.sendMail(mailOptions);
  }

  async function sendFlagAvtivityNotification(username, activityName) {
    try {
      const notificationText = `Your activity titled "${activityName}" has been flagged as inappropriate by our admins! As a result, it is no longer visible to any tourists/guests.`;
      const updatedAdvertiser = await NewAcceptedAdvertiserModel.findOneAndUpdate(
        { Username: username }, // Find the advertiser by username
        {
          $push: { 
            Notifications: { 
              NotificationText: notificationText, 
              Read: false // Default to unread
            }
          }
        },
        { new: true } // Return the updated document
      );
  
      // Check if the advertiser was found
      if (!updatedAdvertiser) {
        console.error(`Advertiser with username "${username}" not found.`);
        return;
      }
  
      console.log(`Notification added to advertiser "${username}" successfully.`);
    } catch (error) {
      console.error(`Error adding notification: ${error.message}`);
    }
  }
  
  
  const readAllDeleteRequests = async (req, res) => {
    try {
        const requests = await DeleteRequestsModel.find(); //Fetch all categories
        res.status(200).json(requests);
    } catch (error) {
        res.status(400).json({ error: error.message }); 
    }
 };

 const rejectRequestDeleteAccout = async (req, res) => {
    try {
        const { Username } = req.body;
        const deletedRequest = await DeleteRequestsModel.findOneAndDelete({ Username: Username });
        if (!deletedRequest) {
            return res.status(404).json({ msg: "No account deletion request found for this username." });
        }

        res.status(200).json({ msg: "The account deletion request has been rejected successfully." });
    } catch (error) {
        console.error('Error rejecting account deletion request:', error);
        res.status(500).json({ error: error.message });
    }
};

const getAdminPassword = async (req, res) => {
    try {
        const { username } = req.query;
        const admin = await NewAdminModel.findOne({Username: username}); //Fetch all categories
        const {Password} = admin;
        res.status(200).json(Password);
    } catch (error) {
        res.status(400).json({ error: error.message }); 
    }
 };


 
 const viewAdvertiserDocument = async (req, res) => {
    try {
      const { Username } = req.query;
  
      // Fetch the advertiser from the database
      const advertiser = await NewUnregisteredAdvertiserModel.findOne({ Username });
  
      if (!advertiser) {
        return res.status(404).json({ error: 'Advertiser not found!' });
      }
  
      // Use the absolute path directly from the database
      const documentPath = advertiser.AdvertiserDocument;
  
      // Check if the file exists
      if (!fs.existsSync(documentPath)) {
        return res.status(404).json({ error: 'Document not found on the server!' });
      }
  
      // Serve the PDF file
      res.setHeader('Content-Type', 'application/pdf');
      res.sendFile(documentPath);
    } catch (error) {
      console.error('Error fetching document:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  const viewTourGuideDocuments = async (req, res) => {
    try {
      const { username, docType } = req.query; // Extract username and document type from query string
  
      if (!username || !docType) {
        return res.status(400).json({ error: "Username and docType are required!" });
      }
  
      // Fetch the tour guide details using the username
      const tourGuide = await NewUnregisteredTourGuideModel.findOne({ Username: username });
  
      if (!tourGuide) {
        return res.status(404).json({ error: "Tour Guide not found!" });
      }
  
      // Determine the document path based on docType
      let documentPath;
      if (docType === 'ID') {
        documentPath = tourGuide.IDDocument;
      } else if (docType === 'Certificate') {
        documentPath = tourGuide.CertificateDocument;
      } else {
        return res.status(400).json({ error: "Invalid docType! Use 'ID' or 'Certificate'." });
      }
  
      // Check if the document exists
      if (!documentPath || !fs.existsSync(documentPath)) {
        return res.status(404).json({ error: "Requested document not found!" });
      }
  
      // Serve the PDF file
      res.setHeader('Content-Type', 'application/pdf');
      res.sendFile(documentPath);
    } catch (error) {
      console.error("Error fetching document:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  const viewSellerDocument = async (req, res) => {
    try {
      const { Username } = req.query; // Extract Username from the query string
  
      if (!Username) {
        return res.status(400).json({ error: 'Username is required!' });
      }
  
      // Fetch the seller details using the Username
      const seller = await NewUnregisteredSellerModel.findOne({ Username });
  
      if (!seller) {
        return res.status(404).json({ error: 'Seller not found!' });
      }
  
      // Use the absolute path directly from the database
      const documentPath = seller.Documents;
  
      if (!documentPath) {
        return res.status(404).json({ error: 'Document not found for this Seller!' });
      }
  
      // Check if the file exists on the server
      if (!fs.existsSync(documentPath)) {
        return res.status(404).json({ error: 'Document not found on the server!' });
      }
  
      // Serve the PDF file
      res.setHeader('Content-Type', 'application/pdf');
      res.sendFile(documentPath, (err) => {
        if (err) {
          console.error('Error sending file:', err);
          res.status(500).json({ error: 'Failed to retrieve the document.' });
        }
      });
    } catch (error) {
      console.error('Error fetching document:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  const getAllUnregisteredAdvertisers = async (req, res) => {
    try {
      // Fetch all unregistered advertisers from the database
      const advertisers = await NewUnregisteredAdvertiserModel.find();
  
      if (advertisers.length === 0) {
        return res.status(404).json({ msg: "No unregistered advertisers found!" });
      }
  
      // Respond with the list of advertisers
      res.status(200).json({
        msg: "Unregistered advertisers fetched successfully!",
        advertisers,
      });
    } catch (error) {
      // Handle any errors
      res.status(500).json({ error: error.message });
    }
  };

  const getAllUnregisteredTourGuides = async (req, res) => {
    try {
      // Fetch all unregistered tour guides from the database
      const tourGuides = await NewUnregisteredTourGuideModel.find();
  
      if (tourGuides.length === 0) {
        return res.status(404).json({ msg: "No unregistered tour guides found!" });
      }
  
      // Respond with the list of tour guides
      res.status(200).json({
        msg: "Unregistered tour guides fetched successfully!",
        tourGuides,
      });
    } catch (error) {
      // Handle any errors
      res.status(500).json({ error: error.message });
    }
};

    const getAllUnregisteredSellers = async (req, res) => {
        try {
          // Fetch all unregistered sellers from the database
          const sellers = await NewUnregisteredSellerModel.find();
      
          if (sellers.length === 0) {
            return res.status(404).json({ msg: "No unregistered sellers found!" });
          }
      
          // Respond with the list of sellers
          res.status(200).json({
            msg: "Unregistered sellers fetched successfully!",
            sellers,
          });
        } catch (error) {
          // Handle any errors
          res.status(500).json({ error: error.message });
        }
      };

      const getAllUnregisteredTransportationAdvertisers = async (req, res) => {
        try {
          // Fetch all unregistered transportation advertisers from the database
          const transportationAdvertisers = await NewUnregisteredTransportationAdvertiserModel.find().sort({ createdAt: -1 });
      
          if (transportationAdvertisers.length === 0) {
            return res.status(404).json({ msg: "No unregistered transportation advertisers found!" });
          }
      
          // Respond with the list of transportation advertisers
          res.status(200).json({
            msg: "Unregistered transportation advertisers fetched successfully!",
            transportationAdvertisers,
          });
        } catch (error) {
          // Handle any errors
          res.status(500).json({ error: error.message });
        }
      };

// Create Promo Code Method in Admin Controller (No expiryDate)
const createPromoCode = async (req, res) => {
  const { code, discountPercentage, isActive } = req.body;

  try {
    // Validate required fields
    if (!code || !discountPercentage) {
      return res.status(400).json({ error: "Code and discount percentage are required." });
    }

    // Check if the promo code already exists using Mongoose's findOne method
    const existingPromoCode = await PromoCode.findOne({ code });
    if (existingPromoCode) {
      return res.status(400).json({ error: "Promo code already exists." });
    }

    // Validate discount percentage (it should be between 0 and 100)
    if (discountPercentage < 0 || discountPercentage > 100) {
      return res.status(400).json({ error: "Discount percentage must be between 0 and 100." });
    }

    // Create new PromoCode document without expiryDate field
    const newPromoCode = new PromoCode({
      code,
      discountPercentage,
      isActive: isActive !== undefined ? isActive : true // Default to true if isActive is not provided
    });

    // Save the promo code to the database using Mongoose's save method
    await newPromoCode.save();

    // Send success response
    return res.status(201).json({
      message: "Promo code created successfully.",
      promoCode: newPromoCode
    });

  } catch (error) {
    console.error("Error creating promo code:", error);
    return res.status(500).json({ error: "Server error. Could not create promo code." });
  }
};

const getTotalTourists = async (req, res) => {
  try {
    // Query the database to count all tourists
    const count = await AllTouristModel.countDocuments();

    // Return the total count of tourists
    res.json({ totalTourists: count });
  } catch (error) {
    console.error('Error fetching total tourists:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getTouristsByMonth = async (req, res) => {
  try {
    const { month } = req.body;

    if (!month) {
      return res.status(400).json({ error: 'Month is required' });
    }

    const monthNumber = parseInt(month) - 1; // Convert to 0-based index (e.g., 0 = January)

    // Get the current year
    const year = new Date().getFullYear();

    // Define the start and end dates of the month
    const startOfMonth = new Date(year, monthNumber, 1);
    const endOfMonth = new Date(year, monthNumber + 1, 0);

    // Query the database for tourists created in the specified month
    const count = await AllTouristModel.countDocuments({
      createdAt: { $gte: startOfMonth, $lt: endOfMonth },
    });

    // Return the count of tourists
    res.json({ month, touristsCount: count });
  } catch (error) {
    console.error('Error fetching tourists by month:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getTotalTourismGovernors = async (req, res) => {
  try {
    const count = await NewTourismGoverner.countDocuments();
    res.json({ totalGovernors: count });
  } catch (error) {
    console.error('Error fetching total tourism governors:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getTourismGovernorsByMonth = async (req, res) => {
  try {
    const { month } = req.body;

    if (!month) {
      return res.status(400).json({ error: 'Month is required' });
    }

    const monthNumber = parseInt(month) - 1;
    const year = new Date().getFullYear();
    const startOfMonth = new Date(year, monthNumber, 1);
    const endOfMonth = new Date(year, monthNumber + 1, 0);

    const count = await NewTourismGoverner.countDocuments({
      createdAt: { $gte: startOfMonth, $lt: endOfMonth },
    });

    res.json({ month, governorsCount: count });
  } catch (error) {
    console.error('Error fetching tourism governors by month:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getTotalTourGuides = async (req, res) => {
  try {
    const count = await NewAcceptedTourGuideModel.countDocuments();
    res.json({ totalTourGuides: count });
  } catch (error) {
    console.error('Error fetching total tour guides:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getTourGuidesByMonth = async (req, res) => {
  try {
    const { month } = req.body;

    if (!month) {
      return res.status(400).json({ error: 'Month is required' });
    }

    const monthNumber = parseInt(month) - 1;
    const year = new Date().getFullYear();
    const startOfMonth = new Date(year, monthNumber, 1);
    const endOfMonth = new Date(year, monthNumber + 1, 0);

    const count = await NewAcceptedTourGuideModel.countDocuments({
      createdAt: { $gte: startOfMonth, $lt: endOfMonth },
    });

    res.json({ month, tourGuidesCount: count });
  } catch (error) {
    console.error('Error fetching tour guides by month:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getTotalSellers = async (req, res) => {
  try {
    const count = await NewAcceptedSellerModel.countDocuments();
    res.json({ totalSellers: count });
  } catch (error) {
    console.error('Error fetching total sellers:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getSellersByMonth = async (req, res) => {
  try {
    const { month } = req.body;

    if (!month) {
      return res.status(400).json({ error: 'Month is required' });
    }

    const monthNumber = parseInt(month) - 1;
    const year = new Date().getFullYear();
    const startOfMonth = new Date(year, monthNumber, 1);
    const endOfMonth = new Date(year, monthNumber + 1, 0);

    const count = await NewAcceptedSellerModel.countDocuments({
      createdAt: { $gte: startOfMonth, $lt: endOfMonth },
    });

    res.json({ month, sellersCount: count });
  } catch (error) {
    console.error('Error fetching sellers by month:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getTotalAdvertisers = async (req, res) => {
  try {
    const count = await NewAcceptedAdvertiserModel.countDocuments();
    res.json({ totalAdvertisers: count });
  } catch (error) {
    console.error('Error fetching total advertisers:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getAdvertisersByMonth = async (req, res) => {
  try {
    const { month } = req.body;

    if (!month) {
      return res.status(400).json({ error: 'Month is required' });
    }

    const monthNumber = parseInt(month) - 1;
    const year = new Date().getFullYear();
    const startOfMonth = new Date(year, monthNumber, 1);
    const endOfMonth = new Date(year, monthNumber + 1, 0);

    const count = await NewAcceptedAdvertiserModel.countDocuments({
      createdAt: { $gte: startOfMonth, $lt: endOfMonth },
    });

    res.json({ month, advertisersCount: count });
  } catch (error) {
    console.error('Error fetching advertisers by month:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getTotalTransportationAdvertisers = async (req, res) => {
  try {
    const count = await NewAcceptedTransportationAdvertiserModel.countDocuments();
    res.json({ totalTransportationAdvertisers: count });
  } catch (error) {
    console.error('Error fetching total transportation advertisers:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getTransportationAdvertisersByMonth = async (req, res) => {
  try {
    const { month } = req.body;

    if (!month) {
      return res.status(400).json({ error: 'Month is required' });
    }

    const monthNumber = parseInt(month) - 1;
    const year = new Date().getFullYear();
    const startOfMonth = new Date(year, monthNumber, 1);
    const endOfMonth = new Date(year, monthNumber + 1, 0);

    const count = await NewAcceptedTransportationAdvertiserModel.countDocuments({
      createdAt: { $gte: startOfMonth, $lt: endOfMonth },
    });

    res.json({ month, transportationAdvertisersCount: count });
  } catch (error) {
    console.error('Error fetching transportation advertisers by month:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getTotalUsers = async (req, res) => {
  try {
    // Get counts for each category using their respective models
    const totalTourists = await AllTouristModel.countDocuments();
    const totalGovernors = await NewTourismGoverner.countDocuments();
    const totalAdvertisers = await NewAcceptedAdvertiserModel.countDocuments();
    const totalSellers = await NewAcceptedSellerModel.countDocuments();
    const totalTourGuides = await NewAcceptedTourGuideModel.countDocuments();
    const totalTransportationAdvertisers = await NewAcceptedTransportationAdvertiserModel.countDocuments();

    // Calculate the total number of users
    const totalUsers =
      totalTourists +
      totalGovernors +
      totalAdvertisers +
      totalSellers +
      totalTourGuides +
      totalTransportationAdvertisers;

    // Return the total count of users and individual counts
    res.json({
      totalUsers,
      counts: {
        tourists: totalTourists,
        governors: totalGovernors,
        advertisers: totalAdvertisers,
        sellers: totalSellers,
        tourGuides: totalTourGuides,
        transportationAdvertisers: totalTransportationAdvertisers,
      },
    });
  } catch (error) {
    console.error('Error fetching total users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getTotalUsersByMonth = async (req, res) => {
  try {
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({ error: 'Month is required' });
    }

    const monthNumber = parseInt(month) - 1; // Convert to 0-based index (0 = January)
    const year = new Date().getFullYear();
    const startOfMonth = new Date(year, monthNumber, 1);
    const endOfMonth = new Date(year, monthNumber + 1, 1);

    // Get counts for each category in parallel
    const [
      touristsCount,
      governorsCount,
      advertisersCount,
      sellersCount,
      tourGuidesCount,
      transportationAdvertisersCount,
    ] = await Promise.all([
      AllTouristModel.countDocuments({ createdAt: { $gte: startOfMonth, $lt: endOfMonth } }),
      NewTourismGoverner.countDocuments({ createdAt: { $gte: startOfMonth, $lt: endOfMonth } }),
      NewAcceptedAdvertiserModel.countDocuments({ createdAt: { $gte: startOfMonth, $lt: endOfMonth } }),
      NewAcceptedSellerModel.countDocuments({ createdAt: { $gte: startOfMonth, $lt: endOfMonth } }),
      NewAcceptedTourGuideModel.countDocuments({ createdAt: { $gte: startOfMonth, $lt: endOfMonth } }),
      NewAcceptedTransportationAdvertiserModel.countDocuments({
        createdAt: { $gte: startOfMonth, $lt: endOfMonth },
      }),
    ]);

    // Calculate total users for the month
    const totalUsers = 
      touristsCount + 
      governorsCount + 
      advertisersCount + 
      sellersCount + 
      tourGuidesCount + 
      transportationAdvertisersCount;

    // Return the total and individual counts
    res.json({
      month,
      totalUsers,
      counts: {
        tourists: touristsCount,
        governors: governorsCount,
        advertisers: advertisersCount,
        sellers: sellersCount,
        tourGuides: tourGuidesCount,
        transportationAdvertisers: transportationAdvertisersCount,
      },
    });
  } catch (error) {
    console.error('Error fetching total users by month:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required." });
    }

    // List of models and their corresponding user types
    const userModels = [
      { model: AllTouristModel, type: "Tourist" },
      { model: NewAcceptedAdvertiserModel, type: "Advertiser" },
      { model: NewAcceptedTourGuideModel, type: "TourGuide" },
      { model: NewAcceptedSellerModel, type: "Seller" },
      { model: NewTourismGoverner, type: "TourismGovernor" },
      { model: NewAdminModel, type: "Admin" },
      { model: NewAcceptedTransportationAdvertiserModel, type: "TransportationAdvertiser" },
    ];

    // Loop through each model to find the user
    for (const { model, type } of userModels) {
      const user = await model.findOne({ Username: username });
      if (user) {
        // Check if the password matches
        if (user.Password !== password) {
          return res.status(401).json({ error: "Invalid password." });
        }

        // Increment LoginCount if it exists
        if (user.LoginCount !== undefined) {
          user.LoginCount = (user.LoginCount || 0) + 1;
          await user.save();
        }

        // Successful authentication
        return res.status(200).json({ message: "Login successful!", userType: type, user, LoginCount: user.LoginCount || 0, });
      }
    }

    // If no user is found
    return res.status(401).json({ error: "Invalid username." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const findUserTypeByUsername = async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: "Username is required." });
  }

  // List of models and their corresponding user types
  const userModels = [
    { model: AllTouristModel, type: "Tourist" },
    { model: NewAcceptedAdvertiserModel, type: "Advertiser" },
    { model: NewAcceptedTourGuideModel, type: "TourGuide" },
    { model: NewAcceptedSellerModel, type: "Seller" },
    { model: NewTourismGoverner, type: "TourismGovernor" },
    { model: NewAdminModel, type: "Admin" },
    { model: NewAcceptedTransportationAdvertiserModel, type: "TransportationAdvertiser" },
  ];

  try {
    // Loop through each model
    for (const { model, type } of userModels) {
      const user = await model.findOne({ Username: username });
      if (user) {
        return res.status(200).json({ username, userType: type });
      }
    }

    // If the username is not found in any model
    return res.status(404).json({ error: "User not found." });
  } catch (error) {
    console.error("Error finding user type:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};



// Function to calculate total app revenue for booked itineraries
const calculateAppRevenueItinerary = async (req, res) => {
  try {
    // Fetch all tourists with booked itineraries
    const tourists = await AllTouristModel.find({ "BookedItineraries.booked": true });
    
    if (!tourists || tourists.length === 0) {
      return res.status(404).json({ error: "No bookings found." });
    }

    let totalRevenue = 0;

    // Iterate through each tourist's booked itineraries
    for (const tourist of tourists) {
      for (const booking of tourist.BookedItineraries) {
        if (booking.booked) {
          // Find the itinerary details from the Itinerary collection
          const itinerary = await ItineraryrModel.findOne({ Title: booking.ItineraryName });
          if (itinerary) {
            totalRevenue += itinerary.Price * 0.10; // Add 10% of the itinerary price to total revenue
          }
        }
      }
    }

    // Return the total calculated revenue
    res.status(200).json({ totalAppRevenue: totalRevenue.toFixed(2) });
  } catch (error) {
    console.error("Error calculating app revenue:", error);
    res.status(500).json({ error: "Failed to calculate app revenue. Please try again later." });
  }
};

// Function to calculate total app revenue for booked activities
const calculateAppRevenueActivity = async (req, res) => {
  try {
    // Fetch all tourists with booked activities
    const tourists = await AllTouristModel.find({ "BookedActivities.booked": true });

    if (!tourists || tourists.length === 0) {
      return res.status(404).json({ error: "No activity bookings found." });
    }

    let totalRevenue = 0;

    // Iterate through each tourist's booked activities
    for (const tourist of tourists) {
      for (const booking of tourist.BookedActivities) {
        if (booking.booked) {
          // Find the activity details from the Activity collection
          const activity = await ActivityModel.findOne({ Name: booking.activityName });
          if (activity) {
            totalRevenue += activity.Price * 0.10; // Add 10% of the activity price to total revenue
          }
        }
      }
    }

    // Return the total calculated revenue
    res.status(200).json({ totalActivityRevenue: totalRevenue.toFixed(2) });
  } catch (error) {
    console.error("Error calculating activity revenue:", error);
    res.status(500).json({ error: "Failed to calculate activity revenue. Please try again later." });
  }
};

// Function to calculate total app revenue for purchased products
const calculateAppRevenueProduct = async (req, res) => {
  try {
    // Fetch all tourists with purchased products
    const tourists = await AllTouristModel.find({ "purchasedProducts.productName": { $exists: true } });

    if (!tourists || tourists.length === 0) {
      return res.status(404).json({ error: "No purchased products found." });
    }

    let totalRevenue = 0;

    // Iterate through each tourist's purchased products
    for (const tourist of tourists) {
      for (const purchasedProduct of tourist.purchasedProducts) {
        if (purchasedProduct.productName) {
          // Find the product details from the Product collection
          const product = await NewProduct.findOne({ Name: purchasedProduct.productName });
          if (product) {
            // Add 10% of the product's total sales to the total revenue
            totalRevenue += (purchasedProduct.quantity || 0) * product.Price * 0.10;
          }
        }
      }
    }

    // Return the total calculated revenue
    res.status(200).json({ totalProductRevenue: totalRevenue.toFixed(2) });
  } catch (error) {
    console.error("Error calculating product revenue:", error);
    res.status(500).json({ error: "Failed to calculate product revenue. Please try again later." });
  }
};

const calculateTotalAppRevenue = async (req, res) => {
  try {
    let totalItineraryRevenue = 0;
    let totalActivityRevenue = 0;
    let totalProductRevenue = 0;

    // Calculate revenue from booked itineraries
    const itineraryTourists = await AllTouristModel.find({ "BookedItineraries.booked": true });
    for (const tourist of itineraryTourists) {
      for (const booking of tourist.BookedItineraries) {
        if (booking.booked) {
          const itinerary = await ItineraryrModel.findOne({ Title: booking.ItineraryName });
          if (itinerary) {
            totalItineraryRevenue += itinerary.Price * 0.10;
          }
        }
      }
    }

    // Calculate revenue from booked activities
    const activityTourists = await AllTouristModel.find({ "BookedActivities.booked": true });
    for (const tourist of activityTourists) {
      for (const booking of tourist.BookedActivities) {
        if (booking.booked) {
          const activity = await ActivityModel.findOne({ Name: booking.activityName });
          if (activity) {
            totalActivityRevenue += activity.Price * 0.10;
          }
        }
      }
    }

    // Calculate revenue from purchased products
    const productTourists = await AllTouristModel.find({ "purchasedProducts.productName": { $exists: true } });
    for (const tourist of productTourists) {
      for (const purchasedProduct of tourist.purchasedProducts) {
        if (purchasedProduct.productName) {
          const product = await NewProduct.findOne({ Name: purchasedProduct.productName });
          if (product) {
            totalProductRevenue += (purchasedProduct.quantity || 0) * product.Price * 0.10;
          }
        }
      }
    }

    // Calculate total app revenue
    const totalAppRevenue = totalItineraryRevenue + totalActivityRevenue + totalProductRevenue;

    // Send the result as response
    res.status(200).json({
      totalItineraryRevenue: totalItineraryRevenue.toFixed(2),
      totalActivityRevenue: totalActivityRevenue.toFixed(2),
      totalProductRevenue: totalProductRevenue.toFixed(2),
      totalAppRevenue: totalAppRevenue.toFixed(2),
    });
  } catch (error) {
    console.error("Error calculating total app revenue:", error);
    res.status(500).json({ error: "Failed to calculate total app revenue. Please try again later." });
  }
};

const notifyAdminOfOutOfStock = async (req, res) => {
  try {
    const products = await NewProduct.find({ Quantity: 0 });
    if (products.length === 0) {
      return res.status(200).json({ message: "No products out of stock." });
    }

    const admin = await NewAdminModel.findOne({ Username: "jj" }); // Replace with dynamic admin username if necessary
    if (!admin) {
      return res.status(404).json({ error: "Admin not found." });
    }

    const outOfStockMessages = products.map(
      (product) => `Product "${product.Name}" is out of stock.`
    );

    admin.Notifications.push(
      ...outOfStockMessages.map((msg) => ({
        NotificationText: msg,
      }))
    );

    await admin.save();

     // Send email notification
     const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: 'malook25062003@gmail.com', // Your email
        pass: 'sxvo feuu woie gpfn', // Your email password or app-specific password
      },
    });

    const emailContent = `
      <h1>Out-of-Stock Notification</h1>
      <p>The following products are out of stock:</p>
      <ul>
        ${outOfStockMessages.map((msg) => `<li>${msg}</li>`).join("")}
      </ul>
    `;

    await transporter.sendMail({
      from: "BeyondBorders@gmail.com", // Replace with your email
      to:  "malook25062003@gmail.com", // Assuming admin's email is stored in `Username`
      subject: "Out-of-Stock Products Notification",
      html: emailContent,
    });

    res.status(200).json({
      message: "Out-of-stock notifications sent to admin successfully.",
    });
  } catch (error) {
    console.error("Error notifying admin:", error);
    res.status(500).json({ error: "An error occurred." });
  }
};


const allNotificationsReadAdmin = async (req, res) => {
  try {
    const { username } = req.body; // Extract admin username from request body
    if (!username) {
      return res.status(400).json({ error: "Username is required." });
    }

    const admin = await NewAdminModel.findOne({ Username: username });
    if (!admin) {
      return res.status(404).json({ error: "Admin not found." });
    }

    if (!admin.Notifications || admin.Notifications.length === 0) {
      return res.status(200).json({
        message: "No notifications to mark as read.",
        admin,
      });
    }

    // Update notifications to "Read: true"
    admin.Notifications.forEach((notification) => {
      notification.Read = true;
    });
    await admin.save();

    res.status(200).json({
      message: "All notifications marked as read successfully.",
      admin,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const areAllNotificationsReadAdmin = async (req, res) => {
  try {
    const { username } = req.query;
    if (!username) {
      return res.status(400).json({ error: "Username is required." });
    }

    const admin = await NewAdminModel.findOne({ Username: username }, "Notifications");
    if (!admin) {
      return res.status(404).json({ error: "Admin not found." });
    }

    const allRead = admin.Notifications.every((notification) => notification.Read);

    res.status(200).json({ allRead });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAdminNotifications = async (req, res) => {
  try {
    const { username } = req.query;
    if (!username) {
      return res.status(400).json({ error: "Username is required." });
    }

    const admin = await NewAdminModel.findOne({ Username: username }, "Notifications");
    if (!admin) {
      return res.status(404).json({ error: "Admin not found." });
    }

    res.status(200).json({ notifications: admin.Notifications });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const filterAdminProducts = async (req, res) => {
  const { username, name, date, month } = req.query;

  if (!username) {
    return res.status(400).json({ error: 'Admin username is required' });
  }

  try {
    const adminProducts = await NewProduct.find({ Seller: new RegExp(`^${username}$`, "i") });
    console.log("Admin Products Found:", adminProducts);

    if (adminProducts.length === 0) {
      return res.status(404).json({ message: 'No products found for this admin.' });
    }

    const adminProductNames = adminProducts.map((product) => product.Name);
    const query = {
      'productsPurchased.productName': { $in: adminProductNames },
    };

    if (date) {
      query.orderDate = new Date(date);
    }

    if (month) {
      const year = new Date().getFullYear();
      const startOfMonth = new Date(year, month - 1, 1);
      const endOfMonth = new Date(year, month, 0);
      query.orderDate = { $gte: startOfMonth, $lte: endOfMonth };
    }

    const orders = await Order.find(query);
    console.log("Orders Found:", orders);

    if (orders.length === 0) {
      return res.status(404).json({
        totalRevenue: "0.00",
        filteredProducts: [],
        message: "No matching orders found.",
      });
    }

    let totalRevenue = 0;
    const filteredProducts = [];
    orders.forEach((order) => {
      order.productsPurchased.forEach((product) => {
        if (
          adminProductNames.includes(product.productName) &&
          (!name || product.productName.toLowerCase().includes(name.toLowerCase()))
        ) {
          const revenue = product.quantity * product.price;
          totalRevenue += revenue;
          filteredProducts.push({
            productName: product.productName,
            quantity: product.quantity,
            price: product.price,
            orderDate: order.orderDate,
            revenue,
          });
        }
      });
    });

    if (filteredProducts.length === 0) {
      return res.status(404).json({
        totalRevenue: "0.00",
        filteredProducts: [],
        message: "No matching products found.",
      });
    }

    res.status(200).json({
      totalRevenue: totalRevenue.toFixed(2),
      filteredProducts,
    });
  } catch (error) {
    console.error("Error filtering products for admin:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getProductsByAdmin = async (req, res) => {
  try {
    // Assuming you get the author's username from query parameters
    const { username } = req.query; 
    
    // Validate that AuthorUsername is provided
    if (!username) {
      return res.status(400).json({ error: "Admin username is required." });
    }

    const products = await NewProduct.find({Seller: username });

    if (!products.length) {
      return res.status(404).json({ error: "You have not created any products." });
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOrderedProductsBySeller = async (req, res) => {
  try {
    const { sellerUsername } = req.query; // Get the seller's username from query parameters

    // Validate that the sellerUsername is provided
    if (!sellerUsername) {
      return res.status(400).json({ error: "Seller username is required." });
    }

    console.log('Fetching products for seller:', sellerUsername);

    // Step 1: Find all products for the seller
    const sellerProducts = await NewProduct.find({ Seller: sellerUsername });
    if (!sellerProducts.length) {
      console.log('No products found for this seller.');
      return res.status(404).json({ error: "No products found for this seller." });
    }

    // Extract product names from the seller's products
    const sellerProductNames = sellerProducts.map((product) => product.Name);
    console.log('Seller Product Names:', sellerProductNames);

    // Step 2: Find orders that contain these product names
    const orders = await Order.find({
      'productsPurchased.productName': { $in: sellerProductNames },
    });

    if (!orders.length) {
      console.log('No orders found for seller products.');
      return res.status(404).json({ error: "No orders found for seller products." });
    }

    // Step 3: Extract and format ordered products
    const orderedProducts = orders.flatMap((order) =>
      order.productsPurchased
        .filter((product) => sellerProductNames.includes(product.productName)) // Filter for this seller's products
        .map((product) => ({
          orderNumber: order.orderNumber,
          orderDate: order.orderDate,
          productName: product.productName,
          quantity: product.quantity,
          price: product.price,
          paymentStatus: order.paymentStatus,
          orderStatus: order.orderStatus,
          deliveryAddress: order.deliveryAddress,
        }))
    );

    console.log('Ordered Products:', orderedProducts);
    res.status(200).json(orderedProducts); // Respond with the list of ordered products
  } catch (error) {
    console.error('Error fetching ordered products by seller:', error.message);
    res.status(500).json({ error: error.message });
  }
};





module.exports = {createNewAdmin, createNewTourismGoverner, createNewProduct, editProduct, acceptSeller, rejectSeller, createNewCategory, readAllActivityCategories, updateCategory, deleteActivityCategory, deleteAccount, searchProductAdmin, createNewTag, readAllTags, updateTag, deleteTag, 
    acceptTourGuide, rejectTourGuide, acceptAdvertiser, rejectAdvertiser, filterProductByPriceAdmin, sortProductsDescendingAdmin, sortProductsAscendingAdmin,viewProducts, loginAdmin, viewAllProductsAdmin, updateAdminPassword, getAllComplaints, updateComplaintStatus, replyToComplaint, getComplaintDetails, 
    filterComplaintsByStatus, sortComplaintsByRecent, sortComplaintsByOldest, archiveProduct, unarchiveProduct, flagItinerary, flagActivity, viewArchivedProductsAdmin , viewAllActivitiesAdmin ,viewAllItinerariesAdmin,acceptTranspAdvertiser,rejectTranspAdvertiser, readAllDeleteRequests,rejectRequestDeleteAccout,
    getAdminPassword,viewAdvertiserDocument,viewTourGuideDocuments,viewSellerDocument,getAllUnregisteredAdvertisers,getAllUnregisteredTourGuides,getAllUnregisteredSellers,getAllUnregisteredTransportationAdvertisers,  createPromoCode, getTotalTourists, getTouristsByMonth
    , getTotalTourismGovernors, getTourismGovernorsByMonth, getTotalTourGuides, getTourGuidesByMonth, getTotalSellers, getSellersByMonth, getTotalAdvertisers, getAdvertisersByMonth, getTotalTransportationAdvertisers, getTransportationAdvertisersByMonth, getTotalUsers, getTotalUsersByMonth, loginUser,findUserTypeByUsername
    ,calculateAppRevenueItinerary
    ,calculateAppRevenueActivity,calculateAppRevenueProduct,calculateTotalAppRevenue,calculateAppRevenueActivity,calculateAppRevenueProduct,calculateTotalAppRevenue,notifyAdminOfOutOfStock,allNotificationsReadAdmin,areAllNotificationsReadAdmin,getAdminNotifications,filterAdminProducts,getProductsByAdmin,getOrderedProductsBySeller
  };
