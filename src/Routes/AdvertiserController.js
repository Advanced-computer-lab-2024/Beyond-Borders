const AdvertiserModel = require('../Models/Advertiser.js');
const { default: mongoose } = require('mongoose');

// const createAdvertiser = async(req,res) => {
//         //Destructure Name, Email, Age from the request body
//         const{Username,Email,Password,Website,Hotline,CompanyProfile} = req.body;
//         try{
//            //add a new user to the database with Name, Email and Age
//            const user = await AdvertiserModel.create({Username,Email,Password,Website,Hotline,CompanyProfile});
//            //Send the created use as a JSON response with a 200 OK status 
//            res.status(200).json({msg:"Advertiser is created!"});
//            //res.status(200).json(user);
//         } catch (error){
//            //If an error occurs, send a 400 Bad Request status with the error message
//            res.status(400).json({ error: error.message});
//         }
//      }
     const ReadAdvertiserProfile = async(req,res) =>{
        try{
         const{username} = req.body;
         const Advertiser = await AdvertiserModel.findOne({ Username: username });
         if (Advertiser) {
           res.status(200).json({Advertiser});
         }
         else{
             res.status(400).json({error : "Advertiser does not exist"});
         }
       } catch (error) {
         res.status(400).json({ error: error.message});
     }
     }
     const updateAdvertiser = async (req, res) => {
        const { _id } = req.body;  // Extract the _id from the request body
      
        try {
            if (req.body.Username) {
                delete req.body.Username;
                return res.status(404).json({ msg: "Cannot update username" });
              }
          // Find and update the tourist with the fields provided in req.body
          const updatedAdvertiser = await AdvertiserModel.findByIdAndUpdate(_id, req.body, {
            new: true,            // Return the updated document
            runValidators: true,  // Ensure the updates respect schema validation rules
          });
          res.status(200).json(updatedAdvertiser);
        } catch (error) {
          // Send a 400 error with the error message if something goes wrong
          res.status(400).json({ error: error.message });
        }
      };
    

      module.exports = {ReadAdvertiserProfile , updateAdvertiser};
