//IMPORT EXPRESS
const router = require("express").Router();

//IMPORT USERMODEL
const UserModel = require('../models/User.model');

//IMPORT BCRYPT
const bcrypt = require('bcryptjs');

//IMPORT CLOUDINARY
const uploader = require('../middlewares/cloudinary.config.js');

//-------------------------- ROUTES ------------------------
//-------------- SIGN UP ---------------
router.post('/signup', (req, res) => {
    const {name, email, password, location} = req.body;
    //empty field verification is done directly in the forms
    // password encryption
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password, salt);
    //create the user in our db
    UserModel.create({name: name, email, passwordHash: hash, location: location})
      .then((user) => {
        // ensuring that we don't share the hash as well with the user
        user.passwordHash = "***";
        res.status(200).json(user);
      })
      .catch((err) => {
        if (err.code === 11000) {
          res.status(500).json({
            errorMessage: 'name or email entered already exists!',
            message: err,
          });
        } 
        else {
          res.status(500).json({
            errorMessage: 'Something went wrong! Go to sleep!',
            message: err,
          });
        }
      })
});
 
// POST for sign in - will handle all POST requests to http:localhost:5005/api/signin
router.post('/signin', (req, res) => {
  //create/require the variables we'll need  
    const {email, password } = req.body;
    // Find if the user exists in the database 
    UserModel.findOne({email})
      .then((userData) => {
           //if the email is found, check for password
          let doesItMatch = bcrypt.compareSync(password, userData.passwordHash)
          //if it matches
          if (doesItMatch) {
            // req.session is the special object that is available to you
            userData.passwordHash = "***";
            req.session.loggedInUser = userData;
            res.status(200).json(userData)
          }
          //if passwords do not match
          else {
              res.status(500).json({
                  error: 'Passwords don\'t match',
              })
            return; 
          }
      })
      //throw an error if the user does not exists 
      .catch((err) => {
        res.status(500).json({
            error: 'Email does not exist',
            message: err
        })
        return;  
      });
  
});
 
// will handle all POST requests to http:localhost:5005/api/logout
router.post('/logout', (req, res) => {
    req.session.destroy();
    // Nothing to send back to the user
    res.status(204).json({});
})

// middleware to check if user is loggedIn
const isLoggedIn = (req, res, next) => {  
  if (req.session.loggedInUser) {
      //calls whatever is to be executed after the isLoggedIn function is over
      next()
  }
  else {
      res.status(401).json({
          message: 'Unauthorized user',
          code: 401,
      })
  };
};

// THIS IS A PROTECTED ROUTE
// will handle all get requests to http:localhost:5005/api/user
router.get("/user", isLoggedIn, (req, res, next) => {
  res.status(200).json(req.session.loggedInUser);
});

module.exports = router;