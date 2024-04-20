import { axiosInstance } from "./AxiosInstance";

//register user

export const RegisterUser = async (payload) => {
  try {
    const response = await axiosInstance.post("/register", payload);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

//login user

export const LoginUser = async (payload) => {
  try {
    const response = await axiosInstance.post("/login", payload);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const ValidateToken = async (payload) => {
  try {
    const response = await axiosInstance.post("/validatetoken", payload);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

// export const UpdateProfile = async (payload) => {
//   try {
//     const response = await axiosInstance.post(
//       "http://localhost:5000/updateUser",
//       payload,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     return error.message;
//   }
// };
export const UpdateProfile = async (payload) => {
  try {
    const formData = new FormData();
    formData.append("pfpfileUpdated", payload.pfpfileUpdated); // Assuming payload.pfpfileUpdated is the file object
    formData.append("id", payload.id);
    formData.append("name", payload.name);
    formData.append("email", payload.email);
    formData.append("age", payload.age);
    formData.append("phone", payload.phone);
    formData.append("gender", payload.gender);

    const response = await axiosInstance.post("/updateUser", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    return error.message;
  }
};

//get current user

// export const GetCurrentUser = async () => {
//   try {
//     const response = await axiosInstance.get(
//       "http://localhost:5000/api/users/get-current-user",
//       { withCredentials: true }
//     );

//     return response.data;
//   } catch (error) {
//     return error.message;
//   }
// };

// //get google user

// export const GetGoogleUser = async () => {
//   try {
//     const response = await axiosInstance.get(
//       "http://localhost:5000/api/users/get-google-user",
//       { withCredentials: true }
//     );

//     return response.data;
//   } catch (error) {
//     return error.message;
//   }
// };

// //logout google user

// export const LogoutGoogleUser = async () => {
//   try {
//     const response = await axiosInstance.get(
//       "http://localhost:5000/api/users/google-logout",
//       { withCredentials: true }
//     );

//     return response.data;
//   } catch (error) {
//     return error.message;
//   }
// };

// //get all users

// export const GetAllUser = async () => {
//   try {
//     const response = await axiosInstance.get(
//       "http://localhost:5000/api/users/get-all-users"
//     );

//     return response.data;
//   } catch (error) {
//     return error.message;
//   }
// };

// //update user status

// export const UpdateUserStatus = async (id, status) => {
//   try {
//     const response = await axiosInstance.put(
//       `http://localhost:5000/api/users/update-user-status/${id}`,
//       { status }
//     );

//     return response.data;
//   } catch (error) {
//     return error.message;
//   }
// };
