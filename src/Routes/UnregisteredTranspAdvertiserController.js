const UnregTransportationAdvertiserModel = require('../Models/UnregisteredTranspAdvertiser.js');
const AllUsernamesModel = require('../Models/AllUsernames.js');
const { default: mongoose } = require('mongoose');

const createUnregisteredTranspAdvertiser= async(req,res) => {
   const{Username,Email,Password,CompanyName,Website,Hotline,CompanyProfile} = req.body;
   try{
      const existingUser = await AllUsernamesModel.findOne({ Username });
      if (existingUser) {
         return res.status(400).json({ error: "Username already exists!" });
      }
      else{
         await AllUsernamesModel.create({Username});
         const user = await UnregTransportationAdvertiserModel.create({Username,Email,Password,CompanyName,Website,Hotline,CompanyProfile});
         res.status(200).json({msg:"Unregistered Advertiser is created!"});
      }
   } catch (error){
      res.status(400).json({ error: error.message});
   }
}

module.exports = {createUnregisteredTranspAdvertiser};
