const express = require("express");
const { AddCourse, GetCourses } = require("../sql/db_functions");
const router = express.Router();

//Add Courses

router.post("/addCourse", async (req, res) => {
  try {
    if (
      !req.body.type ||
      !req.body.duration ||
      !req.body.fees ||
      !req.body.enrollment ||
      !req.body.title
    ) {
      return res.send({
        status: false,
        message: "Invalid Parameters",
      });
    }

    const response = await AddCourse({
      type: req.body.type,
      duration: req.body.duration,
      fees: req.body.fees,
      enrollment: req.body.enrollment,
      title: req.body.title,
    });
    if (!response.status) return res.send(response);

    return res.status(200).send({
      status: true,
      message: "Courses Added Successfully",
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

router.post("/getCourses", async (req, res) => {
  try {
    console.log(`Query`, req.body);
    const response = await GetCourses(req.body);
    if (!response.status) return res.send(response);
    return res.status(200).send({
      status: true,
      message: "Courses Fetched Successfully",
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

module.exports = router;
