import User from "../models/User.js";
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
  

export const googleLogin = async (req,res) => {
    console.log(req.body.email);
    
    try {
      const user = await User.findOne({email: req.body.email})
      // 1. If the user is new , then create an account
      // 2. else authenticate
      
      
      if(user) { // User already present case
          const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        
        const { password: pass, ...rest } = user._doc;
        res
          .cookie('access_token', token, { httpOnly: true })
          .status(200)
          .json(rest);
      }else {
       
        
          const randomPassword = Math.random().toString(36).slice(-8)
          const hashedPassword = bcryptjs.hashSync(randomPassword,10);
  
          const newUser = new User({
            username: req.body.email.split('@')[0],
            email: req.body.email,
            password:hashedPassword
          })
  
          await newUser.save();
          const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
       
          const { password: pass, ...rest } = newUser._doc;
          res
            .cookie('access_token', token, { httpOnly: true })
            .status(200)
            .json(rest);
  
        }
    }
    catch(err) {
      console.log(err.message);
    }
  }
  

  