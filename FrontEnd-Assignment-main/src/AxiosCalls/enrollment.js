import { axiosInstance } from "./AxiosInstance";

//Add ENrollment to course
export const AddEnrollment = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "http://localhost:5000/addEnrollment",
      payload
    );
    return response.data;
  } catch (error) {
    return error.message;
  }
};

//Get UserEnrollments
export const getUserEnrollment = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "http://localhost:5000/getUserEnrollment",
      payload
    );
    return response.data;
  } catch (error) {
    return error.message;
  }
};
