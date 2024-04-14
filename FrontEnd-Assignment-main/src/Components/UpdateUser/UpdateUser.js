// EditProfile.js
import React, { useState } from "react";
import basestyle from "../Base.module.css";
import "./UpdateUser.css";
import { UpdateProfile } from "../../AxiosCalls/users";
import Resizer from "react-image-file-resizer";
import SpinnerComponent from "../Spinner/spinner";

const EditProfile = ({ userProfile, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    id: userProfile.id,
    name: userProfile.fname,
    email: userProfile.email,
    age: userProfile.age,
    phone: userProfile.phone,
    gender: userProfile.gender,
    pfp: userProfile.pfp,
    pfpfileUpdated: null,
  });
  const [loader, setLoader] = useState(false);

  console.log(formData);

  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = (values) => {
    const errors = {};
    const regex = /^[^\s+@]+@[^\s@]+\.[^\s@]{2,}$/i;
    const phoneRegex = /^[0-9]{10}$/; // Assuming phone should be a 10-digit number

    if (!values.name) {
      errors.name = "First name is required";
    }
    if (!values.email) {
      errors.email = "Email is required";
    } else if (!regex.test(values.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!values.age) {
      errors.age = "Age is required";
    } else if (isNaN(values.age)) {
      errors.age = "Age must be a number";
    } else if (parseInt(values.age) <= 0) {
      errors.age = "Age must be a positive number";
    }

    if (!values.phone) {
      errors.phone = "Phone number is required";
    } else if (!phoneRegex.test(values.phone)) {
      errors.phone = "Please enter a valid 10-digit phone number";
    }

    return errors;
  };

  const [selectedFile, setSelectedFile] = useState(null);
  const resizeFile = (file) =>
    new Promise((resolve, reject) => {
      Resizer.imageFileResizer(
        file,
        150, // New width (adjust as needed)
        150, // New height (adjust as needed)
        "JPEG", // Output format (JPEG, PNG, WEBP)
        100, // Quality (0-100)
        0, // Rotation
        (uri) => {
          const blob = dataURLtoBlob(uri);
          resolve(new File([blob], file.name, { type: "image/jpeg" }));
        },
        "base64", // Output type (base64, blob, file)
        150, // Max file size (in KB, 0 for no limit)
        150, // Max width (in pixels, 0 for no limit)
        () => {
          reject(new Error("Image resize failed."));
        }
      );
    });

  const dataURLtoBlob = (dataURL) => {
    const arr = dataURL.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    const resizedImage = await resizeFile(file);
    reader.onload = () => {
      setFormData({
        ...formData,
        pfp: URL.createObjectURL(resizedImage), // Update the pfp value with the resized image URL
        pfpfileUpdated: resizedImage, // Update the pfpfileUpdated field with the resized image file
      });
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = () => {
    const fileInput = document.getElementById("fileInput");
    fileInput.click(); // Trigger the file input to open the file selection dialog
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm(formData);
    setFormErrors(errors);
    console.log(errors);
    await setLoader(true);
    if (Object.values(errors).length === 0) {
      const response = await UpdateProfile(formData);

      if (!response.status) alert(response.message);
      else {
        alert(response.message);
        // window.location.href = "http://localhost:3000/";
      }
    }
    await setLoader(false);
  };

  return (
    <div className="UpdateUser">
      {loader && <SpinnerComponent />}
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <div class="profile-picture">
          <img
            src={formData.pfp}
            alt="User Profile Picture"
            height="100px"
            width="100px"
          />
        </div>
        <input
          type="file"
          id="fileInput"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        <button type="button" onClick={handleUpload}>
          Upload
        </button>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <p className={basestyle.error}>{formErrors.name}</p>
        </div>
        {/* <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="lname"
            value={formData.lname}
            onChange={handleChange}
          />
          <p className={basestyle.error}>{formErrors.lname}</p>
        </div> */}
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <p className={basestyle.error}>{formErrors.email}</p>
        </div>
        <div>
          <label>Phone:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
          <p className={basestyle.error}>{formErrors.phone}</p>
        </div>
        <div>
          <label for="gender">Gender:</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option
              value="male"
              selected={formData.gender === "male" || formData.gender === null}
            >
              Male
            </option>
            <option value="female" selected={formData.gender === "female"}>
              Female
            </option>
            <option value="other" selected={formData.gender === "other"}>
              Other
            </option>
          </select>
          <p className={basestyle.error}>{formErrors.gender}</p>
        </div>
        <div>
          <label>Age:</label>
          <input
            type="text"
            name="age"
            value={formData.age}
            onChange={handleChange}
          />
          <p className={basestyle.error}>{formErrors.age}</p>
        </div>
        {/* <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <p className={basestyle.error}>{formErrors.password}</p>
        </div> */}
        <button type="submit">Save</button>
        <button onClick={onCancel}>Cancel</button>
      </form>
    </div>
  );
};

export default EditProfile;
