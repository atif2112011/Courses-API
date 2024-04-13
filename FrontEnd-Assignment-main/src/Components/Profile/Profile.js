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

  const handleSave = (formData) => {
    setUserProfile(formData);
    setEditMode(false);
  };

  const handleCancel = () => {
    setEditMode(false);
  };

  const [showProperties, setShowProperties] = useState(false);

  return (
    <div className={profilestyle.profile}>
      <h1 style={{ position: "absolute", top: 0, left: 0, color: "black" }}>
        Welcome {username} !!
      </h1>
      <button
        className={basestyle.button_common}
        onClick={() => setShowProperties(!showProperties)}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          padding: "10px 20px",
          color: "#fff",
          width: "150px",
          border: "none",
          borderRadius: "3px",
          cursor: "pointer",
        }}
      >
        Profile
      </button>

      {showProperties && (
        <div style={{ position: "absolute", top: 150, right: 0 }}>
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

      {editMode ? (
        <EditProfile
          userProfile={userProfile}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <div style={{ marginTop: "300px" }}>
          <Courses />
        </div>
      )}
    </div>
  );
};

export default Profile;
