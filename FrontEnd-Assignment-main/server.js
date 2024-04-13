const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

mongoose.connect(
  "mongodb+srv://")
.then(() => {
    console.log("DB connected");
})
.catch(error => {
    console.error("Error connecting to MongoDB:", error);
  }
);

const userSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  email: String,
  password: String,
});

const User = new mongoose.model("User", userSchema);

//Routes
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  // Find user by email
  User.findOne({ email: email })
    .then(user => {
      if (user) {
        // Check password
        if (password === user.password) {
          res.send({ message: "Login successfully", user: user });
        } else {
          res.send({ message: "Password doesn't match" });
        }
      } else {
        res.send({ message: "User not found" });
      }
    })
    .catch(error => {
      console.error("Error finding user:", error);
      res.status(500).send({ message: "Internal server error" });
    });
});

app.post("/signup", (req, res) => {
  const { fname, lname, email, password } = req.body;
  
  // Check if user already exists
  User.findOne({ email: email })
    .then(existingUser => {
      if (existingUser) {
        // User already exists
        return res.status(400).send({ message: "User is already registered" });
      }
      // Create a new user
      const newUser = new User({
        fname,
        lname,
        email,
        password,
      });
      // Save the new user to the database
      return newUser.save();
    })
    .then(() => {
      // User saved successfully
      res.status(200).send({ message: "Account has been created! Please login" });
    })
    .catch(error => {
      // Handle errors
      console.error("Error saving user to database:", error);
      res.status(500).send({ message: "Internal server error" });
    });
});
app.post("/update-profile", (req, res) => {
  const { userId, fname, lname, email, password } = req.body;
  
  // Assuming you have a User model/schema defined
  User.findById(userId)
    .then(user => {
      if (user) {
        // Update user profile fields
        user.fname = fname;
        user.lname = lname;
        user.email = email;
        user.password = password; // Note: You might want to hash the password before storing it
        
        // Save the updated user object
        user.save()
          .then(updatedUser => {
            res.send({ message: "Profile updated successfully", user: updatedUser });
          })
          .catch(error => {
            console.error("Error saving updated user:", error);
            res.status(500).send({ message: "Internal server error" });
          });
      } else {
        res.status(404).send({ message: "User not found" });
      }
    })
    .catch(error => {
      console.error("Error finding user:", error);
      res.status(500).send({ message: "Internal server error" });
    });
});


app.listen(9002, () => {
  console.log("Server starting at 9002");
});
