import { axiosInstance } from "./AxiosInstance";

export const GetCourses = async (payload) => {
  try {
    const response = await axiosInstance.post("/getCourses", payload);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const UpdatedCourse = async (payload) => {
  try {
    const response = await axiosInstance.post("/updateCourse", payload);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const AddCourse = async (payload) => {
  try {
    const response = await axiosInstance.post("/addCourse", payload);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const DeleteCourse = async (payload) => {
  try {
    const response = await axiosInstance.post("/deleteCourse", payload);
    return response.data;
  } catch (error) {
    return error.message;
  }
};
