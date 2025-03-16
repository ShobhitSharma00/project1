
const express = require("express");
const router=express.Router();



 //Index-
 router.get("/",(req,res)=>{
    res.send("Get for users");
  })
  
  //show 
  router.get("/:id",(req,res)=>{
      res.send("get for  users");
    })
    //POST 
  router.post("/",(req,res)=>{
      res.send("post for  users");
    })
  
    //DELETE
    router.delete("/:id",(req,res)=>{
      res.send("DELETE for  users");
    })

    module.exports=router;