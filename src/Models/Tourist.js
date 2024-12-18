const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TouristSchema = new Schema({
  Email: {
    type: String,
    required: true,
  },
  Username: {
    type: String,
    required: true
  },
  Password: {
    type: String,
    required: true,
  },
  MobileNumber: {
    type: String,
    required: true,
  },
  DoB: {
    type: Date,
    required: true,
  }, 
  Nationality: {
    type: String,
    required: true,
  },
  Occupation: {
    type: String,
    required: true,
  },
  Wallet: {
    type: Number,
    required: false
  },
  BookedActivities: [
    {
      activityName: {
        type: String,
        required: false 
      },
      booked: {
        type: Boolean, 
        default: true, 
        required: false 
      },
      DateOfBooking: {
        type: Date,
        required: false,
      }
    }
  ],
  BookedItineraries: [
    {
      ItineraryName: {
        type: String,
        required: false 
      },
      booked: {
        type: Boolean, 
        default: true, 
        required: false 
      },
      DateOfBooking: {
        type: Date,
        required: false,
      }
    }
  ],
  BookedMuseums: [
    {
      MuseumName: {
        type: String,
        required: false 
      },
      booked: {
        type: Boolean, 
        default: true, 
        required: false 
      } 
    }
  ],
  BookedHistPlaces: [
    {
      HistPlaceName: {
        type: String,
        required: false 
      },
      booked: {
        type: Boolean, 
        default: true, 
        required: false 
      } 
    }
  ],
  purchasedProducts: [
    {
      productName: {
        type: String,
        required: false, 
      },
      quantity: {
        type: Number,
        required: false, 
        default: 1, 
      },
      totalSales: {
        type: Number,
        required: false, 
      },
    },
  ],
  completedItineraries: [
    {
      ItineraryName: {
        type: String,
        required: true
      }
    }
  ],
  completedActivities: [
    {
      ActivityName: {
        type: String,
        required: true
      }
    }
  ],
  completedMuseumEvents: [
    {
      MuseumName: {
        type: String,
        required: true
      }
    }
  ],
  completedHistoricalPlaceEvent: [
    {
      HistoricalPlaceName: {
        type: String,
        required: true
      }
    }
  ],
  Points: {
    type: Number,
    required: false
  },
  BadgeLevelOfPoints: {
    type: Number,
    required: false
  },
  BookedFlights: [
    {
      flightID: {
        type: String,
        required: false
      },
      flightDetails: {
        type: Object,
        required: false
      }
    }
  ],
  BookedHotels: [
    {
      hotelID: {
        type: String,
        required: false
      },
      hotelDetails: {
        type: Object,
        required: false
      }
    }
  ],
  BookedTransportation: [
    {
      TransportationName: {
        type: String,
        required: false 
      }
    }
  ],
  BookmarkedEvents: [
    {
      EventName: {
        type: String,
        required: false 
      }
    }
  ],
  MyPreferences: [{type : String , required :true}],
  WishList: [
    {
      productName: {
        type: String,
        required: false 
      }
    }
  ],
  Cart: [
    {
      productName: {
        type: String,
        required: false 
      },
      Quantity:{
        type: Number,
        required: false
      }
    }
  ],
  DeliveryAddresses: [
    {
      address: {
      type: String,
      required: false
    }
  }
  ],
  Orders: [
    {
      OrderNumber: {
      type: String,
      required: false
    }
  }
  ],
  Notifications: [
    {
      NotificationText: {
        type: String,
        required: false,
      },
      Read: {
        type: Boolean,
        default: false, // Default to unread
        required: false,
      },
    }
  ],
    
  
}, { timestamps: true }); // adds Created At & Updated At fields

const Tourist = mongoose.model('Tourist', TouristSchema);
module.exports = Tourist;
