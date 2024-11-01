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
        required: false 
      }
    }
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
  ]
}, { timestamps: true }); // adds Created At & Updated At fields

const Tourist = mongoose.model('Tourist', TouristSchema);
module.exports = Tourist;
