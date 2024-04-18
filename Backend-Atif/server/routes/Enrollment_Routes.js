const express = require("express");
const {
  AddEnrollment,
  GetEnrollment,
  GetCourses,
} = require("../sql/db_functions");
const router = express.Router();

//Add Enrollment

router.post("/addEnrollment", async (req, res) => {
  try {
    if (
      !req.body.user_id ||
      !req.body.user_name ||
      !req.body.course_id ||
      !req.body.course_title ||
      !req.body.enrollment_date
    ) {
      return res.send({
        status: false,
        message: "Invalid Parameters",
      });
    }

    //Check if user is already enrolled
    const checkEnrollment = await GetEnrollment({
      user_id: req.body.user_id,
      course_id: req.body.course_id,
    });

    if (checkEnrollment.data.length > 0)
      return res.send({
        status: false,
        message: "User Already Enrolled",
      });

    const response = await AddEnrollment({
      user_id: req.body.user_id,
      user_name: req.body.user_name,
      course_id: req.body.course_id,
      course_title: req.body.course_title,
      enrollment_date: req.body.enrollment_date,
    });
    if (!response.status) return res.send(response);

    //Send Enrollment Mail
//     const emailResult = await SendMail({
//       recipient: req.body.email,
//       subject: "Course Enrollment Successful",
//       html: `Congratulation on your successful enrollment in ${course_title}`,
//     });

//     if (!emailResult.status)
//       return res.send({
//         status: false,
//         message: emailResult.message,
//       });
    return res.status(200).send({
      status: true,
      message: "Enrollment Added Successfully",
      data: response.data[0],
    });
  } catch (error) {
    console.log(error.message);

    res.send({
      status: false,
      message: error.message,
    });
  }
});

router.post("/getEnrollment", async (req, res) => {
  try {
    const response = await GetEnrollment(req.body);
    if (!response.status) return res.send(response);

    return res.status(200).send({
      status: true,
      message: "Enrollment Fetched Successfully",
      data: response.data,
    });
  } catch (error) {
    console.log(error.message);

    res.send({
      status: false,
      message: error.message,
    });
  }
});

//Get courses in which user enrolled
router.post("/getUserEnrollment", async (req, res) => {
  try {
    if (!req.body.user_id) {
      return res.send({
        status: false,
        message: "Invalid Parameters",
      });
    }
    const UserCourses = await GetEnrollment({
      user_id: req.body.user_id,
    });
    // console.log(`USer Courses Fetchd`, UserCourses);
    const outputData = [];
    for (const course of UserCourses.data) {
      const getCourseData = await GetCourses({ id: course.course_id });
      const courseWithEnrollmentDate = {
        ...getCourseData.data[0],
        enrollment_date: course.enrollment_date,
      };
      // console.log(`Fetched User courses:`, getCourseData.data[0]);
      outputData.push(courseWithEnrollmentDate);
    }

    return res.status(200).send({
      status: true,
      message: "User Enrollment Fetched Successfully",
      data: outputData,
    });
  } catch (error) {
    console.log(error.message);

    res.send({
      status: false,
      message: error.message,
    });
  }
});
module.exports = router;
