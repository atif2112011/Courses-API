import "./App.css";
import Profile from "./Components/Profile/Profile";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Courses from "./Components/Courses/Courses";
import AdminPanel from "./Components/Admin/admin";

function App() {
  const [userstate, setUserState] = useState({});
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              userstate && userstate.id ? (
                <Profile
                  setUserState={setUserState}
                  userstate={userstate}
                  username={userstate.fname}
                />
              ) : (
                <Login setUserState={setUserState} />
              )
            }
          ></Route>
          <Route
            path="/login"
            element={<Login setUserState={setUserState} />}
          ></Route>
          <Route path="/signup" element={<Register />}></Route>
          {/* <Route path="/courses" element={<Courses />}></Route> */}
          <Route path="/admin" element={<AdminPanel />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
