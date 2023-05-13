const Request = require("../models/requestModal");
const Users = require("../models/userModel");

const requestController = {
  addRequest: async (req, res) => {
    try {
      const {  desc, location } = req.body;
      const newRequest = new Request({
        user_id: req.user.id,
        desc,
        location,
      });

      const savedRequest = await newRequest.save();

      const updatedUser = await Users.findByIdAndUpdate(
        req.user.id,
        { $push: { requests: savedRequest._id } },
        { new: true }
      );
      res.status(200).send("Request Register");
      return;
    } catch (error) {
      res.status(400).send(error.message);
    }
  },
  getAllRequest: async (req, res) => {
    try {
      const findAllRequest = await Request.find().populate("user_id").exec() ;         
      res.status(200).send(findAllRequest);
      return;
    } catch (error) {
      res.status(400).send(error.message);
    }
  },
  donate: async (req, res) => {
    try {
      
      const requestId = req.params.requestId ; 
      if(!requestId) {
        return res.status(400).send("No request id recieved") ; 
      }

     
      const updatedRequest = await Request.findByIdAndUpdate(requestId , {$set : {donor_id : req.user.id , status : "Assigned"}  } , {new : true }) ; 
      
      const updatedUser = await Users.findByIdAndUpdate(req.user.id , {$push : { donates : updatedRequest._id} },{new : true}).populate("donates").exec();

      res.status(200).send(updatedUser)  ; 

      return ; 

    } catch (error) {
      res.status(400).send(error.message);
    }
  },
  finalDonate : async(req , res) =>{
    try {
      
        const requestId = req.params.requestId ; 
        if(!requestId) {
          return res.status(400).send("No request id recieved") ; 
        }
  
       
        const updatedRequest = await Request.findByIdAndUpdate(requestId , {$set : { status : "Donated"}  } , {new : true }) ; 
        
  
        res.status(200).send(updatedUser)  ; 
  
        return ; 
  
      } catch (error) {
        res.status(400).send(error.message);
      }
  }
};

module.exports = requestController;
