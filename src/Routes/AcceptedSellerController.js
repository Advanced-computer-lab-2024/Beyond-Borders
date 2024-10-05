// #Task route solution
const AcceptedSellerModel = require('../Models/AcceptedSeller.js');
const NewProduct = require('../Models/Product.js');
const { default: mongoose } = require('mongoose');


const readSellerProfile = async(req,res) =>{
  try{
   const{Username} = req.query;
   const Seller = await AcceptedSellerModel.findOne({ Username: Username });
   if (Seller) {
     res.status(200).json(Seller);
   }
   else{
       res.status(400).json({error : "Seller does not exist"});
   }
 } catch (error) {
   res.status(400).json({ error: error.message});
}
}


const updateSeller = async (req, res) => {
  const { Username } = req.body;  // Extract username from the request body

  try {
      // Ensure username is present for the update
      if (!Username) {
          return res.status(400).json({ msg: "Username is required to update the profile" });
      }

      // Check for other properties before proceeding
      const { Password, Email, Name, Description } = req.body;

      // Perform the update while ensuring the username cannot be changed
      const updatedSeller = await AcceptedSellerModel.findOneAndUpdate(
          { Username: Username },
          { Password, Email, Name, Description },
          { new: true, runValidators: true }
      );

      if (!updatedSeller) {
          return res.status(404).json({ msg: "Seller not found" });
      }

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

    const sortProductsDescendingSeller = async (req, res) => {
      try {
          // Fetch products sorted by ratings in descending order
          const products = await NewProduct.find().sort({ Ratings: -1 });
  
          // Respond with the sorted products
          res.status(200).json(products);
      } catch (error) {
          res.status(400).json({ error: error.message });
      }
  };
  
  const sortProductsAscendingSeller = async (req, res) => {
      try {
          // Fetch products sorted by ratings in ascending order
          const products = await NewProduct.find().sort({ Ratings: 1 });
  
          // Respond with the sorted products
          res.status(200).json(products);
      } catch (error) {
          res.status(400).json({ error: error.message });
      }
  };

//   const sortProductsDescendingSeller = async (req, res) => {
//     try {
//         const products = await NewProduct.find().sort({ Ratings: -1 }); // Sort descending
//         res.status(200).json(products);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };

// const sortProductsAscendingSeller = async (req, res) => {
//     try {
//         const products = await NewProduct.find().sort({ Ratings: 1 }); // Sort ascending
//         res.status(200).json(products);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };


  const viewProductsSeller = async (req, res) => {
    try {
      const {Name} = req.query;  
      
      const products = await NewProduct.find({ Name: Name });
  
      if (!products.length) {
        return res.status(404).json({ error : "There is no product with this name" });
      }
  
      res.status(200).json(products);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  // const viewAllProductsSeller = async (req, res) => {
  //   const products = await NewProduct.find({}).sort({createdAt: -1})
  
  //   for (let index = 0; index < products.length; index++) {
  //       const element = products[index];
  //       //console.log(element.id);
  //   }
  //   res.status(200).json(products)
  // }

  const viewAllProductsSeller = async (req, res) => {
    try {
        const products = await NewProduct.find({}).sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

  const loginSeller = async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Validate input
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required." });
      }
  
      // Find the seller by username
      const seller = await AcceptedSellerModel.findOne({ Username: username });
      if (!seller) {
        return res.status(401).json({ error: "Invalid username." });
      }
  
      // Check if the password matches
      if (seller.Password !== password) {
        return res.status(401).json({ error: "Invalid password." });
      }
  
      // Successful authentication
      res.status(200).json({ message: "Login successful!", seller });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  


  

module.exports = {readSellerProfile, updateSeller, editProductSeller, createNewProductSeller, searchProductSeller, filterProductByPriceSeller, sortProductsAscendingSeller, sortProductsDescendingSeller,viewProductsSeller,viewAllProductsSeller,loginSeller};
