const TransportationAdvertiserModel = require('../Models/TransportationAdvertiser.js');
const TransportationModel = require('../Models/Transportation.js');

const ReadTransportationAdvertiserProfile = async(req,res) =>{
    try{
     const{username} = req.body;
     const TransportationAdvertiser = await TransportationAdvertiserModel.findOne({ Username: username });
     if (TransportationAdvertiser) {
       res.status(200).json({TransportationAdvertiser});
     }
     else{
         res.status(400).json({error : "TransportationAdvertiser does not exist"});
     }
   } catch (error) {
     res.status(400).json({ error: error.message});
 }
 }


 const createNewTransportation = async (req, res) => {
    const { advertiserName, serviceName, serviceType, price, capacity, startLocation, endLocation, schedule } = req.body;
  
    try {
      // Find the advertiser by username
      const existingAdvertiser = await TransportationAdvertiserModel.findOne({ Username: advertiserName });
      if (!existingAdvertiser) {
        return res.status(400).json({ error: "Advertiser not found!" });
      }
  
      // Check if a service with the same name exists for the advertiser
      const existingService = await TransportationModel.findOne({ serviceName, advertiserName });
      if (existingService) {
        return res.status(400).json({ error: "Service with this name already exists for the advertiser!" });
      }
  
      // Create the new transportation option
      const newTransportationOption = await TransportationModel.create({
        advertiserName,
        serviceName,
        serviceType,
        price,
        capacity,
        routeDetails: {
          startLocation,
          endLocation,
        },
        schedule,
        available: true,
      });
  
      // Add the service to the transportation options array in the advertiser document
      existingAdvertiser.transportationOptions.push({ serviceName, serviceType });
      await existingAdvertiser.save();
  
      res.status(200).json({ msg: "New transportation option created successfully!", transportationOption: newTransportationOption });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  

  module.exports = {ReadTransportationAdvertiserProfile , createNewTransportation};
