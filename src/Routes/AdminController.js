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
            const createdSeller = await NewAcceptedTourGuideModel.create({Username, Email, Password, MobileNum, YearsOfExperience, PreviousWork});
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
            const createdSeller = await NewAcceptedAdvertiserModel.create({Username,Email,Password,Website,Hotline,CompanyProfile});
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
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

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
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
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


module.exports = {createNewAdmin, createNewTourismGoverner, createNewProduct, editProduct, acceptSeller, rejectSeller, createNewCategory, readAllActivityCategories, updateCategory, deleteActivityCategory, deleteAccount, searchProductAdmin, createNewTag, readAllTags, updateTag, deleteTag, 
    acceptTourGuide, rejectTourGuide, acceptAdvertiser, rejectAdvertiser, filterProductByPriceAdmin, sortProductsDescendingAdmin, sortProductsAscendingAdmin,viewProducts, loginAdmin, viewAllProductsAdmin, updateAdminPassword, getAllComplaints, updateComplaintStatus, replyToComplaint, getComplaintDetails, 
    filterComplaintsByStatus, sortComplaintsByRecent, sortComplaintsByOldest, archiveProduct, unarchiveProduct, flagItinerary, flagActivity, viewArchivedProductsAdmin , viewAllActivitiesAdmin ,viewAllItinerariesAdmin,acceptTranspAdvertiser,rejectTranspAdvertiser, readAllDeleteRequests,rejectRequestDeleteAccout,
    getAdminPassword,viewAdvertiserDocument,viewTourGuideDocuments,viewSellerDocument,getAllUnregisteredAdvertisers,getAllUnregisteredTourGuides,getAllUnregisteredSellers,getAllUnregisteredTransportationAdvertisers};
