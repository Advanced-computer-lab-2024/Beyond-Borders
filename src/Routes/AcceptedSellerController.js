// #Task route solution
const AcceptedSellerModel = require('../Models/AcceptedSeller.js');
const NewProduct = require('../Models/Product.js');
const { default: mongoose } = require('mongoose');

const readSellerProfile = async(req,res) => {
   //Destructure Name, Email, Age from the request body
   const{LoggedInSellerID} = req.body;
   try{
      //add a new user to the database with Name, Email and Age
      const user = await AcceptedSellerModel.findById(LoggedInSellerID);
      res.status(200).json(user);
   } catch (error){
      //If an error occurs, send a 400 Bad Request status with the error message
      res.status(400).json({ error: error.message});
   }
}

const updateSeller = async (req, res) => {
    const { _id } = req.body;  // Extract the _id from the request body
  
    try {
        if (req.body.Username) {
            delete req.body.Username;
            return res.status(404).json({ msg: "Cannot update username" });
          }
      // Find and update the tourist with the fields provided in req.body
      const updatedSeller = await AcceptedSellerModel.findByIdAndUpdate(_id, req.body, {
        new: true,            // Return the updated document
        runValidators: true,  // Ensure the updates respect schema validation rules
      });
      res.status(200).json(updatedSeller);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  const createNewProductSeller = async(req,res) => {
    //Destructure Name, Email, Age from the request body
    const{Name,Description,Price,Quantity, Seller,Picture} = req.body;
    try{
          //add a new user to the database with Name, Email and Age
          const user = await NewProduct.create({Name,Description,Price,Quantity, Seller,Picture, Reviews: "",Ratings: 0});
          //Send the created use as a JSON response with a 200 OK status 
          res.status(200).json({msg:"New Product is created!"});
          //res.status(200).json(user);
    } catch (error){
       //If an error occurs, send a 400 Bad Request status with the error message
       res.status(400).json({ error: error.message});
    }
 }

  const editProductSeller = async (req, res) => {
    const {ProductID} = req.body;  // Extract the _id from the request body
    //update a user in the database
    try{
        if (req.body.Seller) {
            delete req.body.Seller;
            return res.status(404).json({ msg: "Cannot edit seller" });
        }
       if (req.body.Reviews) {
            delete req.body.Reviews;
            return res.status(404).json({ msg: "Cannot edit Reviews" });
        }
        if (req.body.Ratings) {
            delete req.body.Ratings;
            return res.status(404).json({ msg: "Cannot edit Ratings" });
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

    const searchProductSeller = async (req, res) => {
        const {ProductName} = req.body;
        try {
            const fetchedProduct = await NewProduct.findOne({Name: ProductName}); //Fetch all categories
            res.status(200).json(fetchedProduct);
        } catch (error) {
           res.status(200).json({ msg: "There is no product with this name!" });
        }
     };

     const filterProductByPriceSeller = async (req, res) => {
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

module.exports = {readSellerProfile, updateSeller, editProductSeller, createNewProductSeller, searchProductSeller, filterProductByPriceSeller};
