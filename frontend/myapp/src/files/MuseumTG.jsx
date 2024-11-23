import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import MuseumIcon from "@mui/icons-material/Museum";
import HistoricalPlaceIcon from "@mui/icons-material/AccountBalance";
import LogoutIcon from "@mui/icons-material/Logout";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ImageIcon from "@mui/icons-material/Image";
import TagIcon from "@mui/icons-material/Label";

const MuseumTG = () => {
  const [museums, setMuseums] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Fetch museums
  const fetchMuseumsByAuthor = async () => {
    const AuthorUsername = localStorage.getItem("username");

    if (!AuthorUsername) {
      setErrorMessage("Author username not found. Please log in again.");
      return;
    }

    try {
      const response = await axios.post("/readAllMuseums", { AuthorUsername });

      if (response.status === 200) {
        if (response.data.length === 0) {
          setErrorMessage("You do not have any museums created.");
          setMuseums([]);
        } else {
          setMuseums(response.data);
          setErrorMessage("");
        }
      } else {
        setErrorMessage("Unexpected server response.");
      }
    } catch (error) {
      console.error("Error fetching museums:", error);
      setErrorMessage("An error occurred while fetching museums. Please try again.");
    }
  };

  // Delete a museum
  const removeMuseum = async (museumName) => {
    const AuthorUsername = localStorage.getItem("username");

    if (!AuthorUsername) {
      setErrorMessage("Author username not found. Please log in again.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this museum?")) {
      try {
        const response = await axios.post("/deleteMuseumByName", {
          name: museumName,
          AuthorUsername,
        });

        if (response.status === 200) {
          alert(response.data.message);
          fetchMuseumsByAuthor();
        } else {
          alert("Unexpected response while deleting the museum.");
        }
      } catch (error) {
        console.error("Error deleting museum:", error);
        alert("An error occurred while deleting the museum. Please try again.");
      }
    }
  };

  // Fetch museums on component mount
  useEffect(() => {
    fetchMuseumsByAuthor();
  }, []);

  return (
    <Box sx={styles.container}>
      {/* Sidebar */}
      <Box sx={{ ...styles.sidebar, width: sidebarOpen ? "250px" : "60px" }}>
        <Box sx={styles.sidebarHeader}>
          <Button onClick={() => setSidebarOpen(!sidebarOpen)} sx={styles.menuButton}>
            {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
          </Button>
          {sidebarOpen && (
            <Typography variant="h6" sx={styles.sidebarTitle}>
              Museum Dashboard
            </Typography>
          )}
        </Box>
        <Button
          sx={styles.sidebarButton}
          onClick={() => (window.location.href = "/MuseumTG")}
        >
          <MuseumIcon sx={styles.icon} />
          {sidebarOpen && "Museums"}
        </Button>
        <Button
          sx={styles.sidebarButton}
          onClick={() => (window.location.href = "/HistoricalPlaceTG")}
        >
          <HistoricalPlaceIcon sx={styles.icon} />
          {sidebarOpen && "Historical Places"}
        </Button>
      </Box>
  
      {/* Main Content */}
      <Box sx={{ ...styles.mainContent, marginLeft: sidebarOpen ? "250px" : "60px" }}>
        {/* Top Menu */}
        <Box sx={styles.topMenu}>
          <Typography variant="h6" sx={styles.logo}>
            Museums
          </Typography>
          <Box>
            <Button
              sx={styles.menuButton}
              onClick={() => (window.location.href = "/createMuseum")}
            >
              Add New Museum
            </Button>
            <IconButton onClick={() => alert("Logged out!")} sx={styles.iconButton}>
              <LogoutIcon />
            </IconButton>
          </Box>
        </Box>
  
        <Box sx={styles.activitiesContainer}>
          {errorMessage ? (
            <Typography sx={styles.errorMessage}>{errorMessage}</Typography>
          ) : (
            museums.map((museum, index) => (
              <Box key={index} sx={styles.activityCard}>
                <Box sx={styles.activityContent}>
                  {/* Left Side */}
                  <Box sx={styles.activityLeft}>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "bold", fontSize: "20px", marginBottom: "10px" }}
                    >
                      {museum.name}
                    </Typography>
                    <Typography variant="body2" sx={styles.info}>
                      <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
                      Location: {museum.location}
                    </Typography>
                    <Typography variant="body2" sx={styles.info}>
                      <AttachMoneyIcon fontSize="small" sx={{ mr: 1 }} />
                      Ticket Prices: Foreigner - ${museum.ticketPrices.foreigner}, Native - $
                      {museum.ticketPrices.native}, Student - ${museum.ticketPrices.student}
                    </Typography>
                    <Typography variant="body2" sx={styles.info}>
                      <CalendarTodayIcon fontSize="small" sx={{ mr: 1 }} />
                      Date of Event:{" "}
                      {new Date(museum.dateOfEvent).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Typography>
                    <Typography variant="body2" sx={styles.info}>
                      <AccessTimeIcon fontSize="small" sx={{ mr: 1 }} />
                      Opening Hours: {museum.openingHours}
                    </Typography>
                    <Typography variant="body2" sx={styles.info}>
                      <ImageIcon fontSize="small" sx={{ mr: 1 }} />
                      Pictures: {museum.pictures ? museum.pictures.length : 0} available
                    </Typography>
                    <Typography variant="body2" sx={styles.info}>
                      <TagIcon fontSize="small" sx={{ mr: 1 }} />
                      Tags: {museum.HistoricalTags.join(", ")}
                    </Typography>
                  </Box>
  
                  {/* Divider Line */}
                  <Divider orientation="horizontal" flexItem sx={styles.horizontalDivider} />
  
                  {/* Description Section */}
                  <Box sx={styles.descriptionSection}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "16px",
                        fontWeight: "400",
                        wordBreak: "break-word",
                        color: "#33416b",
                        marginTop: "10px",
                      }}
                    >
                      <strong>Description:</strong> {museum.description || "No description provided."}
                    </Typography>
                  </Box>
                </Box>
  
                {/* Edit/Delete Buttons */}
                <Box sx={styles.museumActions}>
                  <IconButton
                    onClick={() =>
                      (window.location.href = `/editMuseum?name=${encodeURIComponent(
                        museum.name
                      )}&author=${encodeURIComponent(localStorage.getItem("username"))}`)
                    }
                    sx={styles.actionButton}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => removeMuseum(museum.name)}
                    sx={{ ...styles.actionButton, ...styles.deleteButton }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            ))
          )}
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
  sidebar: {
    backgroundColor: "#4d587e",
    color: "#e6e7ed",
    height: "100%",
    position: "fixed",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    transition: "width 0.3s ease",
  },
  sidebarHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  sidebarTitle: {
    fontWeight: "bold",
    marginLeft: "10px",
  },
  sidebarButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    padding: "10px 20px",
    color: "#e6e7ed",
    fontSize: "16px",
    "&:hover": {
      backgroundColor: "#192959",
    },
  },
  icon: {
    marginRight: "10px",
  },
  mainContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    transition: "margin-left 0.3s ease",
    padding: "20px",
  },
  topMenu: {
    width: "100%",
    backgroundColor: "#192959",
    color: "#e6e7ed",
    padding: "10px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    fontWeight: "bold",
  },
  menuButton: {
    color: "#e6e7ed",
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: "#e6e7ed",
      color: "#192959",
    },
  },
  iconButton: {
    color: "#e6e7ed",
    "&:hover": {
      backgroundColor: "#4d587e",
    },
  },
  activityCard: {
    backgroundColor: "#fff",
    padding: "20px",
    margin: "10px 0",
    borderRadius: "10px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  },
  museumActions: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "10px",
    gap: "10px",
  },
  actionButton: {
    color: "#192959",
    "&:hover": {
      color: "#4CAF50",
    },
  },
  deleteButton: {
    color: "#dc3545",
    "&:hover": {
      color: "#a71d2a",
    },
  },
  commentsSection: {
    marginTop: "20px",
  },
  commentHeader: {
    fontWeight: "bold",
  },
  noComments: {
    color: "gray",
  },
  info: {
    marginBottom: "5px",
  },
  activityRating: {
    marginTop: "10px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  tagContainer: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  tag: {
    borderRadius: "16px",
    padding: "5px 10px",
    fontSize: "14px",
    textAlign: "center",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  },
  divider: {
    margin: "20px 0",
    backgroundColor: "#d1d5db",
  },
  horizontalDivider: {
    backgroundColor: "#d1d5db",
    margin: "20px 0",
    height: "1px", // Adjust thickness
  },
  descriptionSection: {
    paddingTop: "10px",
    textAlign: "left",
  },
};

export default MuseumTG;
