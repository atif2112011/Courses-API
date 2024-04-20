import { axiosInstance } from "./AxiosInstance";

//Add ENrollment to course
export const AddEnrollment = async (payload) => {
  try {
    const response = await axiosInstance.post("/addEnrollment", payload);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

//Get UserEnrollments
export const getUserEnrollment = async (payload) => {
  try {
    const response = await axiosInstance.post("/getUserEnrollment", payload);
    return response.data;
  } catch (error) {
    return error.message;
  }
};
