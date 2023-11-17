
// const emailValidator = require("email-validator");
import emailValidator from "email-validator";
import User from "../model/userInfoSchema.js";

const submitForm = async (req, res, next) => {
    const { fullName, email } = req.body;
  
    /// every field is required
    if (!fullName || !email) {
      return res.status(400).json({
        success: false,
        message: "Every field is required"
      });
    }
  
    //validate email using npm package "email-validator"
    const validEmail = emailValidator.validate(email);
    if (!validEmail) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address 📩"
      });
    }
  
    try {
      const userInfo = new User(req.body);

      const result = await userInfo.save();
      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      /// send the message of the email is not unique.
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: `Account already exist with the provided email ${email} 😒`
        });
      }
  
      return res.status(400).json({
        message: error.message
      });
    }
  };

  const getUser = async (req, res, next) => {
    console.log('req',req.body)
    const userId = req.body.id;
    console.log('userId',userId)
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      console.log('user',user)
      return res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };

  export  {
    submitForm, getUser
}