// #Task route solution
const AcceptedSellerModel = require('../Models/AcceptedSeller.js');
const NewProduct = require('../Models/Product.js');
const ArchivedProductsModel = require('../Models/ArchivedProducts.js');
const DeleteRequestsModel = require('../Models/DeleteRequests.js')
const AllTouristModel = require('../Models/Tourist.js');
const Order = require('../Models/Orders.js');


const { default: mongoose } = require('mongoose');

const path = require('path');
const fs = require('fs');
const readSellerProfile = async (req, res) => {
  try {
    const { username } = req.query;
    const Seller = await AcceptedSellerModel.findOne({ Username: username });
    if (Seller) {
      res.status(200).json(Seller);
    } else {
      res.status(400).json({ error: "Seller does not exist" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



const updateSeller = async (req, res) => {
  const { Username } = req.body;  // Extract username from the request body

  try {
      // Ensure username is present for the update
      if (!Username) {
          return res.status(400).json({ msg: "Username is required to update the profile" });
      }

      // Check for other properties before proceeding
      const { Password, Email, Name, Description } = req.body;
      let updateData = { Password, Email, Name, Description };

      // Check if a file was uploaded
      if (req.file) {
          updateData.Logo = `/uploads/${req.file.filename}`; // Save file path
      }

      // Perform the update while ensuring the username cannot be changed
      const updatedSeller = await AcceptedSellerModel.findOneAndUpdate(
          { Username: Username },
          updateData,
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



const createNewProductSeller = async (req, res) => {
  const { Name, Description, Price, Quantity } = req.body;

  try {
    // Get the seller from localStorage or the authenticated session
    const Seller = req.body.Seller; // Ensure the frontend passes this field correctly
    if (!Seller) {
      return res.status(400).json({ error: "Seller name is missing. Please log in." });
    }

    // Check if all required fields are provided
    if (!Name || !Description || !Price || !Quantity || !req.file) {
      return res.status(400).json({ error: "All fields, including an image, are required." });
    }

    // Verify the seller exists
    const existingSeller = await AcceptedSellerModel.findOne({ Username: Seller });
    if (!existingSeller) {
      return res.status(404).json({ error: "Seller does not exist." });
    }

    // Create the product
    const newProduct = await NewProduct.create({
      Name,
      Description,
      Price,
      Quantity,
      Seller,
      Picture: `/uploads/${req.file.filename}`,
      Reviews: [],
      Ratings: 0,
      Sales: 0,
      TotalPriceOfSales: 0,
    });

    res.status(201).json({ msg: "Product created successfully!", product: newProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



 

  // const editProductSeller = async (req, res) => {
  //   const {ProductID} = req.body;  // Extract the _id from the request body
  //   //update a user in the database
  //   try{
  //       if (req.body.Seller) {
  //           delete req.body.Seller;
  //           return res.status(404).json({ msg: "Cannot edit seller" });
  //       }
  //      if (req.body.Reviews) {
  //           delete req.body.Reviews;
  //           return res.status(404).json({ msg: "Cannot edit Reviews" });
  //       }
  //       if (req.body.Ratings) {
  //           delete req.body.Ratings;
  //           return res.status(404).json({ msg: "Cannot edit Ratings" });
  //       }
  //       const updatedProduct = await NewProduct.findByIdAndUpdate(ProductID, req.body, {
  //         new: true,            // Return the updated document
  //         runValidators: true,  // Ensure the updates respect schema validation rules
  //       });
  //       res.status(200).json(updatedProduct);
  //     } catch (error) {
  //       // Send a 400 error with the error message if something goes wrong
  //       res.status(400).json({ error: error.message });
  //     }
  //   };

  const editProductSeller = async (req, res) => {
    const { Name, Description, Price, Quantity } = req.body;
  
    try {
      // Validate seller information
      const Seller = req.body.Seller;
      if (!Seller) {
        return res.status(400).json({ error: "Seller information is required." });
      }
  
      // Check if the product exists and belongs to the seller
      const existingProduct = await NewProduct.findOne({ Name: Name.trim(), Seller });
      if (!existingProduct) {
        return res.status(404).json({ error: "Product not found for the given seller." });
      }
  
      // Prepare updated fields
      const updateFields = { Description, Price, Quantity };
  
      // Replace the picture if a new one is uploaded
      if (req.file) {
        const oldPicturePath = path.join(__dirname, "..",existingProduct.Picture);
        if (fs.existsSync(oldPicturePath)) {
          fs.unlinkSync(oldPicturePath); // Delete the old file
        }
        updateFields.Picture = `/uploads/${req.file.filename}`;
      }
  
      // Update the product
      const updatedProduct = await NewProduct.findOneAndUpdate(
        { Name: Name.trim(), Seller },
        { $set: updateFields },
        { new: true }
      );
  
      res.status(200).json(updatedProduct);
    } catch (error) {
      console.error("Error editing product:", error);
      res.status(500).json({ error: "Failed to edit product" });
    }
  };
  

const getProductsBySeller = async (req, res) => {
  try {
    // Assuming you get the author's username from query parameters
    const { Seller } = req.query; 
    
    // Validate that AuthorUsername is provided
    if (!Seller) {
      return res.status(400).json({ error: "Seller username is required." });
    }

    const products = await NewProduct.find({ Seller: Seller });

    if (!products.length) {
      return res.status(404).json({ error: "You have not created any products." });
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
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

      // Increment LoginCount
      seller.LoginCount = seller.LoginCount + 1; // If LoginCount doesn't exist, set it to 0 and increment
      await seller.save();
      
      // Successful authentication
      res.status(200).json({ message: "Login successful!", seller });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

const viewMyArchivedProductsSeller = async (req, res) => {
  try {
    // Assuming you get the author's username from query parameters
    const { Seller } = req.query; 
    
    // Validate that AuthorUsername is provided
    if (!Seller) {
      return res.status(400).json({ error: "Seller username is required." });
    }

    const products = await ArchivedProductsModel.find({ Seller: Seller });

    if (!products.length) {
      return res.status(404).json({ error: "You have not created any products." });
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const requestDeleteAccountSeller = async (req, res) => {
  try {
      const { Username } = req.body;  
      await DeleteRequestsModel.create({Username : Username,Type: "Seller"});
      res.status(200).json({ msg: "You have reqeuested to delete your account, an admin will view your request!" });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

const decrementLoginCount = async (req, res) => {
  try {
    const { username } = req.body;

    // Find the seller by username and decrement the LoginCount by 1
    const updatedSeller = await AcceptedSellerModel.findOneAndUpdate(
      { Username: username },
      { $inc: { LoginCount: -1 } }, // Decrement LoginCount by 1
      { new: true } // Return the updated document
    );

    // Check if the seller was found and updated
    if (!updatedSeller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    res.status(200).json({ msg: "Login count decremented", updatedSeller });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const calculateSellerRevenue = async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: 'Seller username is required' });
  }

  try {
    // Step 1: Find all products sold by the seller
    const products = await NewProduct.find({ Seller: username });

    if (products.length === 0) {
      return res.status(404).json({ message: 'No products found for this seller' });
    }

    let totalRevenue = 0;

    // Step 2: Traverse the tourists to find purchased products for this seller
    for (const product of products) {
      const productName = product.Name;

      // Find all tourists who have purchased this product
      const tourists = await AllTouristModel.find({
        'purchasedProducts.productName': productName,
      });

      // Calculate revenue for this product
      for (const tourist of tourists) {
        const purchasedProduct = tourist.purchasedProducts.find(
          (item) => item.productName === productName
        );

        if (purchasedProduct) {
          totalRevenue += purchasedProduct.quantity * product.Price;
        }
      }
    }

    // Step 3: Respond with the total revenue
    res.status(200).json({
      sellerUsername: username,
      totalRevenue: totalRevenue.toFixed(2),
    });
  } catch (error) {
    console.error('Error calculating revenue:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const filterSellerProducts = async (req, res) => {
  const { username, name, date, month } = req.query;

  if (!username) {
    return res.status(400).json({ error: 'Seller username is required' });
  }

  try {
    // Find products associated with the seller
    const sellerProducts = await NewProduct.find({ Seller: new RegExp(`^${username}$`, "i") });
    console.log("Seller Products Found:", sellerProducts);

    if (sellerProducts.length === 0) {
      return res.status(404).json({ message: 'No products found for this seller.' });
    }

    const sellerProductNames = sellerProducts.map((product) => product.Name);

    // Build query for filtering orders based on the seller's products
    const query = {
      'productsPurchased.productName': { $in: sellerProductNames },
    };

    // Handle date filtering with normalized time range
    if (date) {
      const inputDate = new Date(date);
      inputDate.setHours(0, 0, 0, 0); // Normalize to start of the day

      // Create date range for the specified day
      query.orderDate = {
        $gte: inputDate, // Start of the day
        $lt: new Date(inputDate.getTime() + 24 * 60 * 60 * 1000), // End of the day
      };
    }

    // Handle month filtering
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

    // Process each order and calculate revenue
    orders.forEach((order) => {
      order.productsPurchased.forEach((product) => {
        if (
          sellerProductNames.includes(product.productName) &&
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

    // Respond with the filtered products and total revenue
    res.status(200).json({
      totalRevenue: totalRevenue.toFixed(2),
      filteredProducts,
    });
  } catch (error) {
    console.error("Error filtering products for seller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



const notifySellerOfOutOfStock = async (req, res) => {
  try {
    const { sellerUsername } = req.body; // Assume seller username is passed in the request body
    if (!sellerUsername) {
      return res.status(400).json({ error: "Seller username is required." });
    }

    const seller = await AcceptedSellerModel.findOne({ Username: sellerUsername });
    if (!seller) {
      return res.status(404).json({ error: "Seller not found." });
    }

    const products = await NewProduct.find({ Seller: sellerUsername, Quantity: 0 });
    if (products.length === 0) {
      return res.status(200).json({ message: "No products out of stock." });
    }

    const outOfStockMessages = products.map(
      (product) => `Product "${product.Name}" is out of stock.`
    );

    seller.Notifications.push(
      ...outOfStockMessages.map((msg) => ({
        NotificationText: msg,
      }))
    );

    await seller.save();

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
      to: seller.Email, // Use the admin's email from the database
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

const allNotificationsReadSeller = async (req, res) => {
  try {
    const { username } = req.body; // Assume seller username is passed in the request body
    if (!username) {
      return res.status(400).json({ error: "Username is required." });
    }

    const seller = await AcceptedSellerModel.findOne({ Username: username });
    if (!seller) {
      return res.status(404).json({ error: "Seller not found." });
    }

    if (!seller.Notifications || seller.Notifications.length === 0) {
      return res.status(200).json({ message: "No notifications to mark as read." });
    }

    seller.Notifications.forEach((notification) => {
      notification.Read = true;
    });

    await seller.save();

    res.status(200).json({
      message: "All notifications marked as read successfully.",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const areAllNotificationsReadSeller = async (req, res) => {
  try {
    const { username } = req.query;
    if (!username) {
      return res.status(400).json({ error: "Username is required." });
    }

    const seller = await AcceptedSellerModel.findOne({ Username: username }, "Notifications");
    if (!seller) {
      return res.status(404).json({ error: "Seller not found." });
    }

    const allRead = seller.Notifications.every((notification) => notification.Read);

    res.status(200).json({ allRead });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSellerNotifications = async (req, res) => {
  try {
    const { username } = req.query;
    if (!username) {
      return res.status(400).json({ error: "Username is required." });
    }

    const seller = await AcceptedSellerModel.findOne({ Username: username }, "Notifications");
    if (!seller) {
      return res.status(404).json({ error: "Seller not found." });
    }

    res.status(200).json({ notifications: seller.Notifications });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};









module.exports = {readSellerProfile, updateSeller, editProductSeller, createNewProductSeller, searchProductSeller, filterProductByPriceSeller, sortProductsAscendingSeller, sortProductsDescendingSeller,viewProductsSeller,viewAllProductsSeller,loginSeller,getProductsBySeller, viewMyArchivedProductsSeller, requestDeleteAccountSeller, decrementLoginCount,calculateSellerRevenue,filterSellerProducts
  ,notifySellerOfOutOfStock,allNotificationsReadSeller,areAllNotificationsReadSeller,getSellerNotifications};
