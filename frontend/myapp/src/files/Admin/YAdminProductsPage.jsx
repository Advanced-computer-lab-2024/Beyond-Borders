import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
  InputAdornment,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import StorefrontIcon from '@mui/icons-material/Storefront';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import MapIcon from '@mui/icons-material/Map';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DescriptionIcon from '@mui/icons-material/Description';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import InventoryIcon from '@mui/icons-material/Inventory';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import AddProductModal from './AddProductModal'; // Adjust the path if needed


import axios from 'axios';

function YAdminProductsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewArchived, setViewArchived] = useState(false);
  const [products, setProducts] = useState([]);
  const [archivedProducts, setArchivedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState({ min: '', max: '' });
  const [scrollPositions, setScrollPositions] = useState({});
  const [expanded, setExpanded] = useState(false);
  const [editMode, setEditMode] = useState({}); // To track which product is in edit mode
  const [editedProduct, setEditedProduct] = useState({}); // To store edited product data
  const [showModal, setShowModal] = useState(false);
  const [addProductModal, setAddProductModal] = useState(false);
 


  useEffect(() => {
    fetchProducts();
    fetchArchivedProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/viewAllProductsAdmin');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchArchivedProducts = async () => {
    try {
      const response = await axios.get('/api/viewArchivedProductsAdmin');
      setArchivedProducts(response.data);
    } catch (error) {
      console.error('Error fetching archived products:', error);
    }
  };

  const searchProducts = () => {
    return products.filter(
      (product) =>
        product &&
        product.Name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filterProductsByPrice = () => {
    const min = parseFloat(priceFilter.min);
    const max = parseFloat(priceFilter.max);

    return products.filter((product) => {
      const price = product.Price;
      if (min && price < min) return false;
      if (max && price > max) return false;
      return true;
    });
  };

  const applyFilters = () => {
    let filtered = [...products];
    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.Name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (priceFilter.min || priceFilter.max) {
      const min = parseFloat(priceFilter.min) || 0;
      const max = parseFloat(priceFilter.max) || Infinity;
      filtered = filtered.filter(
        (product) => product.Price >= min && product.Price <= max
      );
    }
    return filtered;
  };
  

  const archiveProduct = async (productId) => {
    try {
      await axios.post('/api/archiveProduct', { ProductID: productId });
      alert('Product archived successfully!');
      fetchProducts();
      fetchArchivedProducts();
    } catch (error) {
      console.error('Error archiving product:', error);
    }
  };

  const unarchiveProduct = async (productId) => {
    try {
      await axios.post('/api/unarchiveProduct', { ProductID: productId });
      alert('Product unarchived successfully!');
      fetchProducts();
      fetchArchivedProducts();
    } catch (error) {
      console.error('Error unarchiving product:', error);
    }
  };

  const sortAscending = async () => {
    try {
      const response = await axios.get('/api/sortProductsAscendingAdmin');
      setProducts(response.data);
    } catch (error) {
      console.error('Error sorting products ascending:', error);
    }
  };
  
  const sortDescending = async () => {
    try {
      const response = await axios.get('/api/sortProductsDescendingAdmin');
      setProducts(response.data);
    } catch (error) {
      console.error('Error sorting products descending:', error);
    }
  };
  

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handlePriceFilterChange = (e) => {
    const { name, value } = e.target;
    setPriceFilter((prev) => ({ ...prev, [name]: value }));
  };

  const renderRating = (rating) => {
    const roundedRating = Math.round(rating * 10) / 10;
    const fullStars = Math.floor(rating);
    const halfStars = roundedRating > fullStars ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStars;

    return (
      <Box sx={styles.ratingContainer}>
        <Typography
          variant="body2"
          sx={{ fontSize: '24px', position: 'absolute', right: '170px', bottom: '2px' }}
        >
          {roundedRating}
        </Typography>
        {[...Array(fullStars)].map((_, index) => (
          <StarIcon key={`full-${index}`} sx={{ fontSize: '32px' }} />
        ))}
        {[...Array(emptyStars)].map((_, index) => (
          <StarBorderIcon key={`empty-${index}`} sx={{ fontSize: '32px' }} />
        ))}
      </Box>
    );
  };

  const scrollCommentsLeft = (index) => {
    const container = document.getElementById(`commentsContainer-${index}`);
    container.scrollLeft -= 200;
    updateScrollPosition(index, container.scrollLeft - 200);
  };

  const scrollCommentsRight = (index) => {
    const container = document.getElementById(`commentsContainer-${index}`);
    container.scrollLeft += 200;
    updateScrollPosition(index, container.scrollLeft + 200);
  };

  const updateScrollPosition = (index, scrollLeft) => {
    setScrollPositions((prev) => ({ ...prev, [index]: scrollLeft }));
  };

  const displayedProducts = viewArchived ? archivedProducts : applyFilters();


  const handleEditClick = (product) => {
    setEditMode((prev) => ({ ...prev, [product._id]: true }));
    setEditedProduct(product); // Populate the editable product data
  };
  

  const handleSaveClick = async (productName) => {
    try {
      const updatePayload = { ...editedProduct };
      delete updatePayload.Seller; // Remove Seller before sending
  
      await axios.put('/api/editProduct', {
        Name: productName,
        ...updatePayload, // Send only allowed fields
      });
      alert('Product updated successfully!');
      setEditMode((prev) => ({ ...prev, [productName]: false }));
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product.');
    }
  };


  const handleCreateProduct = async (newProduct) => {
    try {
      const response = await axios.post('/api/addProduct', newProduct);
      console.log("Product created:", response.data);
      alert("Product created successfully!");
      setAddProductModal(false);
    } catch (error) {
      if (error.response) {
        console.error("Server Error:", error.response.data);
        alert(`Error: ${error.response.data.error}`);
      } else {
        console.error("Unexpected Error:", error.message);
        alert(`Unexpected Error: ${error.message}`);
      }
    }
  };
  
  
  
  
  const handleInputChange = (e, field) => {
    setEditedProduct((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };
  

  const toggleExpandDescription = (productId) => {
    setExpanded((prevState) => ({
      ...prevState,
      [productId]: !prevState[productId],
    }));
  };

  return (
    <Box sx={styles.container}>
      {sidebarOpen && <Box sx={styles.overlay} onClick={() => setSidebarOpen(false)} />}
      {/* Top Menu */}
      <Box sx={styles.topMenu}>
        <Box sx={styles.menuIconContainer}>
          <IconButton onMouseEnter={() => setSidebarOpen(true)} color="inherit">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={styles.logo}>
            Beyond Borders
          </Typography>
        </Box>
        <Box sx={styles.topMenuRight}>
          <Button
            onClick={() => setViewArchived((prev) => !prev)}
            sx={styles.menuButton}
          >
            {viewArchived ? "View Unarchived Products" : "View Archived Products"}
          </Button>
          <Button
            onClick={() => setShowModal(true)} // Open modal
            sx={styles.addProductButton}
          >
            Add Product
          </Button>
        </Box>
      </Box>

      {/* Add Product Modal */}
      <AddProductModal
        open={showModal}
        handleClose={() => setShowModal(false)} // Close modal
        handleCreateProduct={handleCreateProduct} // Handle product creation
      />


      {/* Sidebar */}
      <Box
        sx={{
          ...styles.sidebar,
          width: sidebarOpen ? '280px' : '60px',
        }}
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
      >
        <Button sx={styles.sidebarButton}>
          <StorefrontIcon sx={styles.icon} />
          {sidebarOpen && 'Products'}
        </Button>
        <Button sx={styles.sidebarButton}>
          <LocalActivityIcon sx={styles.icon} />
          {sidebarOpen && 'Activities'}
        </Button>
        <Button sx={styles.sidebarButton}>
          <MapIcon sx={styles.icon} />
          {sidebarOpen && 'Itineraries'}
        </Button>
        <Button sx={styles.sidebarButton}>
          <AssignmentIcon sx={styles.icon} />
          {sidebarOpen && 'Complaints'}
        </Button>
        <Button sx={styles.sidebarButton}>
          <DashboardIcon sx={styles.icon} />
          {sidebarOpen && 'Dashboard'}
        </Button>
      </Box>

      {/* Main Content */}
<Box sx={styles.content}>
  {!viewArchived && (
    <Box sx={styles.filterContainer}>
      {/* Search Bar */}
      <TextField
        label="Search Products"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={handleSearchChange}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={styles.searchBar}
      />

      {/* Price Filters */}
      <TextField
        label="Min Price"
        variant="outlined"
        name="min"
        value={priceFilter.min}
        onChange={handlePriceFilterChange}
        sx={styles.priceFilter}
      />
      <TextField
        label="Max Price"
        variant="outlined"
        name="max"
        value={priceFilter.max}
        onChange={handlePriceFilterChange}
        sx={styles.priceFilter}
      />

      {/* Sort Icons */}
      <Box sx={styles.sortIconsContainer}>
        <IconButton onClick={sortDescending} title="Sort Descending">
          <SortByAlphaIcon sx={{ transform: 'rotate(180deg)' }} />
        </IconButton>
        <IconButton onClick={sortAscending} title="Sort Ascending">
          <SortByAlphaIcon />
        </IconButton>
      </Box>
    </Box>
  )}

        {/* Product List */}
        <Box>
          {displayedProducts.map((product, index) => (
            <Box key={product._id}>
                <Box sx={styles.productCard}>
                     {/* Product Name */}
                    <Typography 
                    variant="h6" sx={styles.productTitle}>{product.Name}
                    </Typography>

                    {/* Product Seller */}
                    <Box sx={styles.productDetail}>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                        <PersonIcon fontSize="small" sx={{ mr: 1 }} />
                        {editMode[product._id] ? (
                        <TextField
                            value={editedProduct.Seller || ''}
                            onChange={(e) => handleInputChange(e, 'Seller')}
                            sx={{ width: '50%', maxWidth: '600px', minWidth: '150px' }} // Adjust the width
                            size="small" // Smaller input size
                            disabled // Disable editing for the seller field
                        />
                        ) : (
                        product.Seller
                        )}
                    </Typography>
                    </Box>

                    {/* Product Price */}
                    <Box sx={styles.productDetail}>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                        <AttachMoneyIcon fontSize="small" sx={{ mr: 1 }} />
                        {editMode[product._id] ? (
                        <TextField
                            value={editedProduct.Price || ''}
                            onChange={(e) => handleInputChange(e, 'Price')}
                            sx={{ width: '50%', maxWidth: '600px', minWidth: '150px' }} // Adjust the width
                            size="small" // Smaller input size
                        />
                        ) : (
                        `Price: ${product.Price}`
                        )}
                    </Typography>
                    </Box>

                    {/* Product Quantity */}
                    <Box sx={styles.productDetail}>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                        <InventoryIcon fontSize="small" sx={{ mr: 1 }} />
                        {editMode[product._id] ? (
                        <TextField
                            value={editedProduct.Quantity || ''}
                            onChange={(e) => handleInputChange(e, 'Quantity')}
                            sx={{ width: '50%', maxWidth: '600px', minWidth: '150px' }} // Adjust the width
                            size="small" // Smaller input size
                        />
                        ) : (
                        `Quantity: ${product.Quantity}`
                        )}
                    </Typography>
                    </Box>

                    {/* Product Sales */}
                    <Box sx={styles.productDetail}>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                        <ShoppingCartIcon fontSize="small" sx={{ mr: 1 }} />
                        {editMode[product._id] ? (
                        <TextField
                            value={editedProduct.Sales || 0}
                            onChange={(e) => handleInputChange(e, 'Sales')}
                            sx={{ width: '50%', maxWidth: '600px', minWidth: '150px' }} // Adjust the width
                            size="small" // Smaller input size
                            disabled
                        />
                        ) : (
                        `Sales: ${product.Sales}`
                        )}
                    </Typography>
                    </Box>

                     {/* Product Total Price of Sales */}
                <Box sx={styles.productDetail}>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                    <AttachMoneyIcon fontSize="small" sx={{ mr: 1 }} />
                    {editMode[product._id] ? (
                        <TextField
                            value={editedProduct.Sales || 0}
                            onChange={(e) => handleInputChange(e, 'Total Price of Sales')}
                            sx={{ width: '50%', maxWidth: '600px', minWidth: '150px' }} // Adjust the width
                            size="small" // Smaller input size
                            disabled
                        />
                        ) : (
                        `Total Price of Sales: ${product.TotalPriceofSales}`
                        )}
                    </Typography>
                    </Box>

               {/* Product Description */}
                    <Box sx={styles.productDetail}>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                        <DescriptionIcon fontSize="small" sx={{ mr: 1 }} />
                        {editMode[product._id] ? (
                        // Render the editable TextField only in edit mode
                        <TextField
                            value={editedProduct.Description || ''}
                            onChange={(e) => handleInputChange(e, 'Description')}
                            multiline
                            sx={{ width: '600px' }} // Fixed smaller width
                            size="small"
                            rows={2}
                        />
                        ) : (
                        // Render the description text with Read More/Read Less logic in non-edit mode
                        <>
                            {product.Description.length > 100 && !expanded[product._id] ? (
                            <>
                                {product.Description.slice(0, 100)}...
                                <Typography
                                component="span"
                                onClick={() => toggleExpandDescription(product._id)}
                                sx={{ cursor: 'pointer', color: 'blue', ml: 1 }}
                                >
                                Read More
                                </Typography>
                            </>
                            ) : (
                            <>
                                {product.Description}
                                {product.Description.length > 100 && (
                                <Typography
                                    component="span"
                                    onClick={() => toggleExpandDescription(product._id)}
                                    sx={{ cursor: 'pointer', color: 'blue', ml: 1 }}
                                >
                                    Read Less
                                </Typography>
                                )}
                            </>
                            )}
                        </>
                        )}
                    </Typography>
             
              {/* Edit/Save Button */}
                    <Box sx={styles.productActions}>
                    {editMode[product._id] ? (
                        <IconButton
                        onClick={() => handleSaveClick(product._id)}
                        title="Save Changes"
                        sx={styles.actionButton}
                        >
                        <SaveIcon />
                        </IconButton>
                    ) : (
                        <IconButton
                        onClick={() => handleEditClick(product)}
                        title="Edit Product"
                        sx={styles.actionButton}
                        >
                        <EditIcon />
                        </IconButton>
                    )}
                    </Box>

                </Box>

                {/* Archive/Unarchive Button */}
                <IconButton
                    onClick={() =>
                    viewArchived ? unarchiveProduct(product._id) : archiveProduct(product._id)
                    }
                    sx={styles.archiveButton}
                >
                    {viewArchived ? <UnarchiveIcon /> : <ArchiveIcon />}
                </IconButton>
               
                <Box sx={styles.activityRating}>
                  {renderRating(product.Ratings)}
                </Box>
              </Box>

              {/* Comments Section */}
              <Box sx={styles.commentsSection}>
                {product.Reviews && product.Reviews.length > 0 ? (
                  <>
                    {scrollPositions[index] > 0 && (
                      <IconButton
                        sx={styles.scrollButton}
                        onClick={() => scrollCommentsLeft(index)}
                      >
                        <ArrowBackIcon />
                      </IconButton>
                    )}
                    <Box
                      sx={styles.commentsContainer}
                      id={`commentsContainer-${index}`}
                      onScroll={(e) =>
                        updateScrollPosition(index, e.target.scrollLeft)
                      }
                    >
                      {product.Reviews.map((review, idx) => (
                        <Box key={idx} sx={styles.commentCard}>
                          <Typography variant="body2">
                            {review.Review || 'No comment available'}
                          </Typography>
                          <Typography variant="caption">
                            @ {review.touristUsername || 'Anonymous'}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                    {product.Reviews.length >= 3 && (
                      <IconButton
                        sx={styles.scrollButton}
                        onClick={() => scrollCommentsRight(index)}
                      >
                        <ArrowForwardIcon />
                      </IconButton>
                    )}
                  </>
                ) : (
                  <Typography variant="body2">No comments available</Typography>
                )}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#e6e7ed',
    color: '#192959',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
  topMenu: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#192959',
    color: '#e6e7ed',
    position: 'sticky',
    top: 0,
    zIndex: 2,
  },
  menuIconContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '18px',
  },
  logo: {
    fontWeight: 'bold',
    color: '#e6e7ed',
  },
  topMenuRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
  },
  menuButton: {
    color: '#e6e7ed',
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: '#e6e7ed',
      color: '#192959',
    },
  },
  sidebar: {
    backgroundColor: '#4d587e',
    color: '#e6e7ed',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    left: 0,
    top: 60,
    height: 'calc(100vh - 60px)',
    width: '60px',
    transition: 'width 0.3s ease',
    overflowX: 'hidden',
    padding: '10px',
    zIndex: 2,
  },
  sidebarButton: {
    color: '#e6e7ed',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    textAlign: 'left',
    width: '100%',
    padding: '10px 20px',
    fontSize: '16px',
    '&:hover': {
      backgroundColor: '#192959',
    },
  },
  icon: {
    marginRight: '10px',
    fontSize: '20px',
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '20px 70px 20px 90px',
    marginLeft: '60px',
    transition: 'margin-left 0.3s ease',
  },
  filterContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '20px',
  },
  searchBar: {
    flex: 2,
  },
  priceFilter: {
    flex: 1,
  },
  sortIconsContainer: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  sortIcon: {
    fontSize: '24px',
    color: '#192959',
    '&:hover': {
      color: '#4d587e',
    },
  },
  productCard: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
    border: '1px solid #ccc',
    position: 'relative',
    textAlign: 'left',
  },
  productTitle: {
    fontWeight: 'bold',
    fontSize: '20px',
    marginBottom: '10px',
  },
  productDetail: {
    marginBottom: '10px',
  },
  archiveButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    color: '#192959',
  },
  commentsSection: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '10px',
    overflow: 'hidden',
    width: '100%',
  },
  commentsContainer: {
    display: 'flex',
    overflowX: 'auto',
    scrollBehavior: 'smooth',
    width: '100%',
    padding: '10px',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  scrollButton: {
    color: '#192959',
    backgroundColor: '#e6e7ed',
    '&:hover': {
      backgroundColor: '#d1d5db',
    },
  },
  commentCard: {
    minWidth: '400px',
    backgroundColor: '#f3f4f6',
    borderRadius: '8px',
    padding: '10px',
    marginRight: '10px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
  },
  activityRating: {
    position: 'absolute',
    bottom: '20px',
    right: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  productActions: {
    display: 'flex',
    justifyContent: 'flex-start', // Change alignment if needed
    alignItems: 'center',
    gap: '10px',
    position: 'absolute', // Adjust position
    top: '10px',
    right: '50px',
    zIndex: 1, // Ensure it renders above other elements
  },
  actionButton: {
    color: '#192959',
    '&:hover': {
      color: '#4d587e',
    },
  },
  addProductButton: {
    backgroundColor: "#192959",
    color: "#e6e7ed",
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: "#e6e7ed", // Background changes to white
      color: "#192959", // Text changes to #192959
    },
  },
  
};

export default YAdminProductsPage;
