//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require('ejs');
const mongoose = require("mongoose");
// const encrypt = require("mongoose-encryption");
// const md5 = require("md5");
const bcrypt =require("bcrypt");
const saltRounds = 10;
const app = express();

app.use(express.static("public"));
app.set('view engine' , 'ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/userDB", {
  useUnifiedTopology: true,
  useNewUrlParser: true
});
mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});
// const secret = process.env.SECRET;
// userSchema.plugin(encrypt, {secret:secret, encryptedFields:["password"]});
const User = mongoose.model("User", userSchema);

app.get("/", function(req, res) {
  res.render("home");
});
app.get("/login", function(req, res) {
  res.render("login");
});
app.get("/register", function(req, res) {
  res.render("register");
});

app.post("/register", function(req, res) {
  var username = req.body.username;
  // var password = req.body.password;
  // var password = md5(req.body.password);
  var password = req.body.password;
  // const user = new User({
  //   email: username,
  //   password: password
  // });
  // user.save(function(err){
  //   if(err) {
  //     console.log(err);
  //   } else {
  //     console.log("Successfully Added ..");
  //     res.render("secrets");
  //   }
  // })
  bcrypt.hash(password, saltRounds, function(err, hash) {
    const user = new User({
      email: username,
      password: hash
    });
    user.save(function(err){
      if(err) {
        console.log(err);
      } else {
        console.log("Successfully Added ..");
        res.render("secrets");
      }
    })

  })
});

app.post("/login", function(req, res) {
  var username = req.body.username;
  // var password = req.body.password;
  // var password = md5(req.body.password);
  var password = req.body.password;
  // User.findOne({email: username}, function(err, foundUser) {
  //   if(err) {
  //     console.log(err);
  //   } else {
  //     if(foundUser.password === password) {
  //       res.render("secrets");
  //     }
  //   }
  // });
  User.findOne({email: username}, function(err, foundUser) {
    if(err) {
      console.log(err);
    } else {
      if(foundUser) {
        bcrypt.compare(password, foundUser.password, function(err, result){
          if(result === true) {
            res.render("secrets");
          }
        })
      }
    }
  });
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
})
