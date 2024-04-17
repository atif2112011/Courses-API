const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const {
  GetUserByID,
  GetUserByEmail,
  AddNewUser,
  UpdateUser,
} = require("../sql/db_functions");
const router = express.Router();
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const zxcvbn = require("zxcvbn");
const SendMail = require("../resend/resend");

cloudinary.config({
  cloud_name: "dufl26uv9",
  api_key: "774326173281585",
  api_secret: "2sZc_0GzYr1D1G1duNLau2So6kE",
});

// Multer upload setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Specify the directory where files will be saved temporarily
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original file name for saving
  },
});

const upload = multer({ storage: storage });

//Registration of New User
router.post("/register", async (req, res) => {
  try {
    //Checking if parameters are present or not
    if (
      !req.body.name ||
      !req.body.email ||
      !validator.isEmail(req.body.email) ||
      !req.body.password
    )
      return res.send({
        status: false,
        message: "Invalid Input",
      });

    //Check if user exist
    const UserFound = await GetUserByEmail({
      email: req.body.email,
    });

    if (UserFound.data.length > 0)
      return res.send({
        status: false,
        message: "Email Already Exists",
      });

    //CHeck password Strength

    const score = await zxcvbn(req.body.password);
    if (score <= 2) {
      return res.send({
        status: false,
        message: "Weak Password..Use a strong one",
      });
    }
    //Password Hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;

    const response = await AddNewUser({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    if (!response.status)
      return res.send({
        status: false,
        message: response.message,
      });

    //Send Registration Mail
    const emailResult = await SendMail({
      recipient: req.body.email,
      subject: "Registration Successfull",
      html: "We are delighted to welcome you on our platform",
    });

    if (!emailResult.status)
      return res.send({
        status: false,
        message: emailResult.message,
      });

    return res.status(200).send({
      status: true,
      message: "Registration Successful",
      data: response.data[0],
    });
  } catch (error) {
    console.log(error.message);

    res.send({
      status: false,
      message: error.message,
    });
  }
});

//Get User By ID
router.post("/getUser", async (req, res) => {
  try {
    //Checking if parameters are present or not
    if (!req.body.id)
      return res.status(400).send({
        status: false,
        message: "Invalid Input",
      });
    const response = await GetUserByID({
      id: req.body.id,
    });

    if (!response.status) return res.status(400).send(response);

    return res.status(200).send({
      status: true,
      message: "User Found Successfully",
      data: response.data[0],
    });
  } catch (error) {
    console.log(error.message);

    res.status(400).send({
      status: false,
      message: error.message,
    });
  }
});

//Login User
router.post("/login", async (req, res) => {
  try {
    console.log(req.body);
    //Checking if parameters are present or not
    if (!req.body.email || !req.body.password)
      return res.send({
        status: false,
        message: "Invalid Input",
      });

    //Check if User Exists Or Not
    const userFound = await GetUserByEmail({
      email: req.body.email,
    });

    // return res.send(userFound);
    if (userFound.data.length == 0)
      return res.send({
        status: false,
        message: "Wrong Email",
      });

    //Password Validation

    const validPassword = await bcrypt.compare(
      req.body.password,
      userFound.data[0].password
    );

    if (!validPassword)
      return res.send({
        status: false,
        message: "Wrong Password",
      });

    //Generate Token
    const token = jwt.sign({ id: userFound.data[0].id }, "jwtsecret", {
      // expiresIn: "1d",
    });

    res.status(200).send({
      status: true,
      message: "User Logged Successfully",
      token: token,
    });
  } catch (error) {
    console.log(error.message);

    res.send({
      status: false,
      message: error.message,
    });
  }
});

//Validate Token
router.post("/validatetoken", async (req, res) => {
  try {
    if (!req.body.token)
      return res.send({
        status: false,
        message: "Invalid Parameters",
      });

    const decoded = await jwt.verify(req.body.token, "jwtsecret");

    const UserId = decoded.id;
    const user = await GetUserByID({
      id: UserId,
    });

    if (user.data.length == 0)
      return res.send({
        status: true,
        message: "Token Invalid",
        data: decoded,
      });

    return res.send({
      status: true,
      message: "Token verified",
      data: user.data[0],
    });
  } catch (error) {
    console.log(error.message);

    res.send({
      status: false,
      message: error.message,
    });
  }
});

//Update User Details
router.post(
  "/updateUser",
  upload.single("pfpfileUpdated"),
  async (req, res) => {
    console.log(req.body);
    try {
      if (!req.body.id)
        return res.send({
          status: false,
          message: "ID not present in request",
        });
      // Check if file was uploaded
      if (req.file) {
        // Upload file to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "profile_pictures", // Optional folder in Cloudinary
        });

        // Update pfp field in req.body with Cloudinary URL
        req.body.pfp = result.secure_url;
      }

      // Remove pfpFileUpdated field from req.body
      delete req.body.pfpFileUpdated;
      const response = await UpdateUser(req.body);

      if (!response.status) return res.send(response);

      return res.send({
        status: true,
        message: "User Updated Successfully",
      });
    } catch (error) {
      console.log(error.message);

      res.send({
        status: false,
        message: error.message,
      });
    }
  }
);
module.exports = router;
