const bcrypt = require('bcryptjs');
const saltRounds = 10;
const router = require("express").Router();

const User = require('../models/User.model');



//the signup page + create the use while making sure the user follows the model + encrypting the password for safety
//Then, redirect to the profile page
router.get("/signup", (req, res) => {
    console.log('req session', req.session);
    res.render("auth/signup.hbs");
  });

  router.post("/signup", (req, res) => {
    const { username, password } = req.body;
    console.log(req.body);
   
    bcrypt
      .genSalt(saltRounds)
      .then(salt => bcrypt.hash(password, salt))
      .then(hashedPassword => {
        return User.create({
          username,
          password: hashedPassword
        });
      })
      .then(userFromDB => {
        console.log('Newly created user is: ', userFromDB);
        req.session.currentUser = userFromDB;
        res.redirect('/auth/profile.hbs');
      })
      .catch(error => console.log(error));
    })


  //login

router.get("/login", (req, res) => {
    console.log('req session', req.session);
    res.render("auth/login.hbs");
  });


  // Profile page

  router.get("/profile", (req, res) => {
    console.log('profile page', req.session);
    const { username } = req.session.currentUser;
      res.render("auth/profile.hbs", {username});
  });


  module.exports = router;
