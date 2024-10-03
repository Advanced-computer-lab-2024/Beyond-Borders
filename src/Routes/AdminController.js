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





const { default: mongoose } = require('mongoose');

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

 const createNewProduct = async(req,res) => {
   //Destructure Name, Email, Age from the request body
   const{Name,Description,Price,Quantity, Seller,Picture} = req.body;
   try{
      const existingSeller = await NewAcceptedSellerModel.findOne({ Username: Seller });
       if (existingSeller) {
         //add a new user to the database with Name, Email and Age
         const user = await NewProduct.create({Name,Description,Price,Quantity, Seller,Picture, Reviews: "",Ratings: 0});
         //Send the created use as a JSON response with a 200 OK status 
         res.status(200).json({msg:"New Product is created!"});
         //res.status(200).json(user);
       }
      else{
         res.status(400).json({msg:"This seller does not exist!"});
      }
   } catch (error){
      //If an error occurs, send a 400 Bad Request status with the error message
      res.status(400).json({ error: error.message});
   }
}

const editProduct = async (req, res) => {
   const {ProductID} = req.body;  // Extract the _id from the request body
   //update a user in the database
   try{
      if (req.body.Seller) {
         delete req.body.Seller;
         return res.status(404).json({ msg: "Cannot update seller" });
      }
       const updatedProduct = await NewProduct.findByIdAndUpdate(ProductID, req.body, {
         new: true,            // Return the updated document
         runValidators: true,  // Ensure the updates respect schema validation rules
       });
       res.status(200).json(updatedProduct);
     } catch (error) {
       // Send a 400 error with the error message if something goes wrong
       res.status(400).json({ error: error.message });
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

const rejectSeller = async (req, res) => {
   const { UnregisteredSellerID } = req.body;

   try {
       // Find the unregistered seller by ID
       const existingUser = await NewUnregisteredSellerModel.findById(UnregisteredSellerID);
       
       if (existingUser) {
            // Extract Username
            const {Username, Email, Password} = existingUser;
            await AllUsernamesModel.findOneAndDelete({Username});
           // Delete the unregistered seller
           await NewUnregisteredSellerModel.findByIdAndDelete(UnregisteredSellerID);
           // Respond with success message
           res.status(200).json({ msg: "Seller has been rejected!" });
       } else {
           res.status(404).json({ error: "Unregistered seller not found." });
       }
   } catch (error) {
       // Handle any errors that occur during the process
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

        res.status(200).json({ msg: "Tag has been deleted and removed from activities!" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const deleteAccount = async (req, res) => {
   const {Username} = req.body;

   try {
       // Find the unregistered seller by ID
       const existingUser = await AllUsernamesModel.findOne({Username});
       
       if (existingUser) {
           // Delete username from AllUsernames Model
           await AllUsernamesModel.findOneAndDelete({Username});
           const existingTourist = await AllTouristModel.findOne({Username});
           //const existingTourGuide = await AllTouristModel.findOne({Username});
           const existingAdmin = await NewAdminModel.findOne({Username});
           const existingSeller = await NewAcceptedSellerModel.findOne({Username});
           //const existingAdvertiser = await AllTouristModel.findOne({Username});
           const existingTourismGovernor = await NewTourismGoverner.findOne({Username});
           if (existingTourist) {
               await AllTouristModel.findOneAndDelete({Username});
           }
           else if(existingAdmin){
               await NewAdminModel.findOneAndDelete({Username});
           }
           else if(existingSeller){
               await NewAcceptedSellerModel.findOneAndDelete({Username});
           }
           else if(existingTourismGovernor){
               await NewTourismGoverner.findOneAndDelete({Username});
           }
           //Redudant else
           else{
               res.status(404).json({ error: "Account with this username doest not exist." });
           }
         //   else if(){
            
         //   }
         //   else if(){
            
         //   }
           // Respond with success message
           res.status(200).json({ msg: "Account has been deleted!" });
       } else {
           res.status(404).json({ error: "Account with this username doest not exist." });
       }
   } catch (error) {
       // Handle any errors that occur during the process
       res.status(400).json({ error: error.message });
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

module.exports = {createNewAdmin, createNewTourismGoverner, createNewProduct, editProduct, acceptSeller, rejectSeller, createNewCategory, readAllActivityCategories, updateCategory, deleteActivityCategory, deleteAccount, searchProductAdmin, createNewTag, readAllTags, updateTag, deleteTag, acceptTourGuide, rejectTourGuide, acceptAdvertiser, rejectAdvertiser, filterProductByPriceAdmin, sortProductsDescendingAdmin, sortProductsAscendingAdmin,viewProducts};
