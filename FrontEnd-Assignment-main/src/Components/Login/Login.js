import React, { useState, useEffect } from "react";
import basestyle from "../Base.module.css";
import loginstyle from "./Login.module.css";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";
import { LoginUser, ValidateToken } from "../../AxiosCalls/users";
const Login = ({ setUserState }) => {
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [user, setUserDetails] = useState({
    email: "",
    password: "",
  });

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setUserDetails({
      ...user,
      [name]: value,
    });
  };
  const validateForm = (values) => {
    const error = {};
    const regex = /^[^\s+@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!values.email) {
      error.email = "Email is required";
    } else if (!regex.test(values.email)) {
      error.email = "Please enter a valid email address";
    }
    if (!values.password) {
      error.password = "Password is required";
    }
    return error;
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    setFormErrors(validateForm(user));
    // setIsSubmit(true);

    const response = await LoginUser(user);
    if (!response.status) {
      alert(response.message);
      // console.log(response);
    } else {
      alert(response.message);
      localStorage.setItem("token", response.token);
      window.location.href = "http://localhost:3000/";
    }
  };

  useEffect(async () => {
    if (localStorage.getItem("token")) {
      const response = await ValidateToken({
        token: localStorage.getItem("token"),
      });
      if (response.status) {
        const user = {
          fname: response.data.name,
          email: response.data.email,
          id: response.data.id,
          age: response.data.age,
          phone: response.data.phone,
          gender: response.data.gender,
          pfp: response.data.pfp,
        };

        await setUserState(user);
      }
    }
  }, [formErrors]);
  return (
    <div className={loginstyle.login}>
      <form>
        <h1>Login</h1>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Email"
          onChange={changeHandler}
          value={user.email}
        />
        <p className={basestyle.error}>{formErrors.email}</p>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          onChange={changeHandler}
          value={user.password}
        />
        <p className={basestyle.error}>{formErrors.password}</p>
        <button className={basestyle.button_common} onClick={loginHandler}>
          Login
        </button>
      </form>
      <NavLink to="/signup">Not yet registered? Register Now</NavLink>
    </div>
  );
};
export default Login;
