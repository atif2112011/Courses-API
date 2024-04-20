import { axiosInstance } from "./AxiosInstance";

export const GetCourses = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "http://localhost:5000/getCourses",
      payload
    );
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const UpdatedCourse = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "http://localhost:5000/updateCourse",
      payload
    );
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const AddCourse = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "http://localhost:5000/addCourse",
      payload
    );
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const DeleteCourse = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "http://localhost:5000/deleteCourse",
      payload
    );
    return response.data;
  } catch (error) {
    return error.message;
  }
};
