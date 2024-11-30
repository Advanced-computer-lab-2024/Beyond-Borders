import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
  InputAdornment,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
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
import AddIcon from '@mui/icons-material/Add';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

import AddProductModalSeller from './AddProductModalSeller'; // Adjust the path if needed


import axios from 'axios';

function YSellerProductsPage() {
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
 
  const username = localStorage.getItem('username') || 'User'; // Retrieve username from localStorage

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchArchivedProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/getProductsBySeller', {
        params: { Seller: username },
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchArchivedProducts = async () => {
    try {
      const response = await axios.get('/api/viewMyArchivedProductsSeller', {
        params: { Seller: username },
      });
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
  

  const handleSaveClick = async (productId) => {
    try {
      const formData = new FormData();
      formData.append("Name", editedProduct.Name);
      formData.append("Seller", localStorage.getItem("username")); // Ensure the seller is logged in
  
      if (editedProduct.Price) formData.append("Price", editedProduct.Price);
      if (editedProduct.Quantity) formData.append("Quantity", editedProduct.Quantity);
      if (editedProduct.Description) formData.append("Description", editedProduct.Description);
      if (editedProduct.Picture instanceof File) {
        formData.append("Picture", editedProduct.Picture);
      }
  
      await axios.put(`/api/editProductSeller`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      alert("Product updated successfully!");
      fetchProducts(); // Refresh product list
      setEditMode((prev) => ({ ...prev, [productId]: false }));
      setEditedProduct({});
    } catch (error) {
      console.error("Error updating product:", error);
      alert(error.response?.data?.error || "Failed to update product.");
    }
  };
  


  const handleCreateProduct = async (formData) => {
    try {
      const seller = localStorage.getItem("username"); // Fetch the logged-in seller's username
      if (!seller) {
        alert("Seller information is missing. Please log in.");
        return;
      }
  
      // Ensure Seller is appended only once and as a string
      if (!formData.has("Seller")) {
        formData.append("Seller", seller);
      }
  
      const response = await axios.post("/api/addProductSeller", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      alert("Product created successfully!");
      fetchProducts(); // Refresh product list
      setAddProductModal(false);
    } catch (error) {
      console.error("Error creating product:", error);
      alert(`Error: ${error.response?.data?.error || error.message}`);
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
            sx={{
                backgroundColor: "#192959",
                color: "#e6e7ed",
                fontWeight:"bold",
                "&:hover": { color: "#192959",backgroundColor: "#e6e7ed" },
              }}
              startIcon={<AddIcon />}
          >
            Add Product
          </Button>
        </Box>
      </Box>

      {/* Add Product Modal */}
      <AddProductModalSeller
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
        <Button onClick={() => navigate('/YSellerProductsPage')} sx={styles.sidebarButton}>
          <StorefrontIcon sx={styles.icon} />
          {sidebarOpen && ' My Products'}
        </Button>
        <Button onClick={() => navigate('/YSellerAllProductsPage')} sx={styles.sidebarButton}>
          <LocalOfferIcon sx={styles.icon} />
          {sidebarOpen && ' All Products'}
        </Button>
        <Button onClick={() => navigate('/YSellerSalesPage')} sx={styles.sidebarButton}>
          <AssignmentIcon sx={styles.icon} />
          {sidebarOpen && 'Sales Reports'}
        </Button>
        <Button onClick={() => navigate('/YSellerDashboard')} sx={styles.sidebarButton}>
          <DashboardIcon sx={styles.icon} />
          {sidebarOpen && 'Back to Dashboard'}
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
                <Box sx={styles.productImageContainer}>
    <img
      src={`http://localhost:8000${product.Picture}`}
      alt="Product"
      style={styles.productImage}
    />
    {editMode[product._id] && (
      <>
        <Box
          sx={styles.editIconOverlay}
          onClick={() => document.getElementById(`file-input-${product._id}`).click()}
        >
          <EditIcon />
        </Box>
        <input
          id={`file-input-${product._id}`}
          type="file"
          accept="image/*"
          style={styles.hiddenInput}
          onChange={(e) =>
            setEditedProduct((prev) => ({
              ...prev,
              Picture: e.target.files[0],
            }))
          }
        />
      </>
    )}
  </Box>
                     {/* Product Name */}
                     <Box sx={styles.productDetailsContainer}>
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
               <Box sx={{ marginBottom: '10px', maxWidth: '100%' }}>
                  <Typography variant="body2" sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <DescriptionIcon fontSize="small" sx={{ mr: 1 }} />
                      {editMode[product._id] ? (
                        <TextField
                          value={editedProduct.Description || ''}
                          onChange={(e) => handleInputChange(e, 'Description')}
                          multiline
                          sx={{ width: '100%', maxWidth: '400px' }} // Limit the width of the editable box
                          size="small"
                          rows={3} // Shorter height for the editable box
                        />
                      ) : (
                        <Typography
                          variant="body2"
                          sx={{
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word',
                            textAlign: 'left',
                          }}
                        >
                          {product.Description.length > 100 && !expanded[product._id] ? (
                            <>
                              {product.Description.slice(0, 100)}...
                              <Typography
                                component="span"
                                onClick={() => toggleExpandDescription(product._id)}
                                sx={styles.readMore}
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
                                  sx={styles.readMore}
                                >
                                  Read Less
                                </Typography>
                              )}
                            </>
                          )}
                        </Typography>
                      )}
                    </Box>
                  </Typography>
                </Box>
             
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
    display: 'flex',
    alignItems: 'flex-start', // Align items at the top
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
    border: '1px solid #ccc',
    textAlign: 'left',
    minHeight: '150px', // Ensure the height matches the image
    position: 'relative', // Allow positioning of child elements
    flexWrap: 'wrap', // Allow wrapping of content inside the card
  },
  productTitle: {
    fontWeight: 'bold',
    fontSize: '20px',
    marginBottom: '10px',
    textAlign: 'left', // Align text to the left
    alignSelf: 'flex-start', // Position the title to the left of its container
  },
  
  productDetail: {
    marginBottom: '10px',
    maxWidth: '80%',
  },
  archiveButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    color: '#192959',
    backgroundColor: '#fff',
    boxShadow: 'none', // Optional styling
    '&:hover': {
      color: '#4d587e',
      backgroundColor: '#f5f5f5',
    },
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
    bottom: '10px',
    right: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  productActions: {
    position: 'absolute',
    top: '10px',
    right: '60px', // Leave space for the archive button
    display: 'flex',
    gap: '10px',
    zIndex: 1,
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
  productImageContainer: {
    position: 'relative',
    width: '200px', // Adjust image size
    height: '200px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '10px',
    overflow: 'hidden',
    marginRight: '20px',
    backgroundColor: 'transparent',
    flexShrink: 0, // Prevent image from shrinking
    transform: 'translateY(40px)', // Move the image down by 10px
  },
  
  productImage: {
    width: '100%', // Ensure the image fills the container
    height: '100%',
    objectFit: 'cover', // Maintain aspect ratio while filling the container
    border: 'none', // Remove any border around the image
   
  },
  productDetailsContainer: {
    flex: 1, // Take the remaining space
    display: 'flex',
    flexDirection: 'column',
    gap: '10px', // Add spacing between details
    minWidth: 0, // Prevent overflow
  },
  editIconOverlay: {
    position: 'absolute', // Overlay on top of the image
    top: '50%', // Center vertically within the container
    left: '50%', // Center horizontally
    transform: 'translate(-50%, -50%)', // Exact centering
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    color: '#fff', // Icon color
    borderRadius: '50%', // Round overlay
    padding: '10px', // Padding for the icon
    cursor: 'pointer', // Pointer cursor for interactivity
    zIndex: 2, // Ensure it stays above the image
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  hiddenInput: {
    position: 'absolute', // Position it absolutely within the container
    top: 0,
    left: 0,
    width: 0, // Ensure it takes no space
    height: 0, // Ensure it takes no space
    opacity: 0, // Fully hide it
  },
  readMore: {
    cursor: 'pointer',
    color: 'blue',
    display: 'block',
    marginTop: '5px',
  },
  
};

export default YSellerProductsPage;
