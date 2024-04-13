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
