import React, { useState } from "react";
import basestyle from "../Base.module.css";
import profilestyle from "./Profile.module.css";
import EditProfile from "../UpdateUser/UpdateUser";
import Courses from "../Courses/Courses";


const Profile = ({ setUserState, username, userstate }) => {
  const [editMode, setEditMode] = useState(false);
  const [userProfile, setUserProfile] = useState({
    id: userstate.id,
    fname: userstate.fname,
    lname: userstate.lname,
    age: userstate.age,
    phone: userstate.phone,
    gender: userstate.gender,
    pfp: userstate.pfp,
    email: userstate.email,
    password: userstate.password,
  });
  const [loader, setLoader] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSave = (formData) => {
    setUserProfile(formData);
    setEditMode(false);
  };

  const handleCancel = () => {
    setEditMode(false);
  };

  const [showProperties, setShowProperties] = useState(false);

  return (
    <div className={profilestyle.header_div}>
      <div className={profilestyle.header || "dropdown"}>
        <h1>Welcome {username} !!</h1>
        <div className={profilestyle.dropdown}>
          <button
            className={basestyle.button_common}
            onClick={() => (window.location.href = "/admin")}
          >
            Admin
          </button>
          <button
            className={basestyle.button_common || "dropbtn"}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            Profile
          </button>

          {showDropdown && (
            <div className={profilestyle.dropdownContent}>
              <button
                className={basestyle.button_common}
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </button>
              <button
                className={basestyle.button_common}
                onClick={() => {
                  localStorage.removeItem("token");
                  setUserState({});
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {editMode ? (
        <EditProfile
          userProfile={userProfile}
          onCancel={handleCancel}
          setShowDropdown={setShowDropdown}
        />
      ) : (
        <div>
          <Courses userProfile={userProfile} />
        </div>
      )}
    </div>
  );
};

export default Profile;
