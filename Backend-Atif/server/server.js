require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const multer = require("multer");
// const dbconfig = require("./config/dbconfig");
const port = process.env.port || 5000;
const { AddCourse } = require("./sql/db_functions");

const User_Routes = require("./routes/User_Routes");
const Courses_Routes = require("./routes/Courses_Routes");
const app = express();
const storage = multer.memoryStorage();
const upload = multer({ storage });
const cors = require("cors");
app.use(cors());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);
app.use(express.json());
app.use(User_Routes);
app.use(Courses_Routes);
const startServer = async () => {
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
};

app.get("/", (req, res) => {
  res.send({
    status: "success",
    message: "Server is running successfully",
  });
});

app.post("/check-post", async (req, res) => {
  console.log(req.body);
  console.log("hi");
  res.send(req.body);
});

startServer();
const data = [
  {
    type: "Mathematics",
    duration: 8,
    fees: 99.99,
    enrollment: "open",
    title: "Introduction to Mathematics",
  },
  {
    type: "Computer Science",
    duration: 12,
    fees: 149.99,
    enrollment: "closed",
    title: "Introduction to Programming",
  },
  {
    type: "Literature",
    duration: 10,
    fees: 129.99,
    enrollment: "open",
    title: "English Literature Fundamentals",
  },
  {
    type: "Psychology",
    duration: 6,
    fees: 79.99,
    enrollment: "open",
    title: "Introduction to Psychology",
  },
  {
    type: "Art",
    duration: 8,
    fees: 99.99,
    enrollment: "open",
    title: "History of Art",
  },
  {
    type: "Physics",
    duration: 10,
    fees: 149.99,
    enrollment: "closed",
    title: "Physics for Beginners",
  },
  {
    type: "Biology",
    duration: 8,
    fees: 99.99,
    enrollment: "open",
    title: "Introduction to Biology",
  },
  {
    type: "Chemistry",
    duration: 10,
    fees: 129.99,
    enrollment: "open",
    title: "Fundamentals of Chemistry",
  },
  {
    type: "Marketing",
    duration: 6,
    fees: 79.99,
    enrollment: "open",
    title: "Digital Marketing Essentials",
  },
  {
    type: "Web Development",
    duration: 12,
    fees: 149.99,
    enrollment: "closed",
    title: "Introduction to Web Development",
  },
  {
    type: "Photography",
    duration: 8,
    fees: 99.99,
    enrollment: "open",
    title: "Photography Basics",
  },
  {
    type: "Artificial Intelligence",
    duration: 10,
    fees: 129.99,
    enrollment: "open",
    title: "Introduction to Artificial Intelligence",
  },
  {
    type: "Music",
    duration: 6,
    fees: 79.99,
    enrollment: "open",
    title: "Music Theory",
  },
  {
    type: "Finance",
    duration: 8,
    fees: 99.99,
    enrollment: "open",
    title: "Introduction to Cryptocurrency",
  },
  {
    type: "Design",
    duration: 10,
    fees: 129.99,
    enrollment: "open",
    title: "Graphic Design Fundamentals",
  },
  {
    type: "Data Science",
    duration: 12,
    fees: 149.99,
    enrollment: "closed",
    title: "Introduction to Data Science",
  },
  {
    type: "Computer Science",
    duration: 8,
    fees: 99.99,
    enrollment: "open",
    title: "Python Basics",
  },
  {
    type: "Mathematics",
    duration: 12,
    fees: 149.99,
    enrollment: "closed",
    title: "Algebraic Structures",
  },
  {
    type: "Literature",
    duration: 10,
    fees: 129.99,
    enrollment: "open",
    title: "Shakespearean Literature",
  },
  {
    type: "Computer Science",
    duration: 6,
    fees: 79.99,
    enrollment: "open",
    title: "Java Fundamentals",
  },
  {
    type: "Mathematics",
    duration: 8,
    fees: 99.99,
    enrollment: "open",
    title: "Calculus Basics",
  },
  {
    type: "Literature",
    duration: 12,
    fees: 149.99,
    enrollment: "closed",
    title: "Modern Literature",
  },
  {
    type: "Computer Science",
    duration: 10,
    fees: 129.99,
    enrollment: "open",
    title: "Web Development Basics",
  },
  {
    type: "Mathematics",
    duration: 6,
    fees: 79.99,
    enrollment: "open",
    title: "Geometry Essentials",
  },
  {
    type: "Literature",
    duration: 8,
    fees: 99.99,
    enrollment: "open",
    title: "Classic Novels",
  },
  {
    type: "Computer Science",
    duration: 12,
    fees: 149.99,
    enrollment: "closed",
    title: "Database Management Systems",
  },
  {
    type: "Mathematics",
    duration: 10,
    fees: 129.99,
    enrollment: "open",
    title: "Probability Theory",
  },
  {
    type: "Literature",
    duration: 8,
    fees: 99.99,
    enrollment: "open",
    title: "Poetry Workshop",
  },
  {
    type: "Computer Science",
    duration: 6,
    fees: 79.99,
    enrollment: "open",
    title: "Mobile App Development",
  },
  {
    type: "Mathematics",
    duration: 8,
    fees: 99.99,
    enrollment: "open",
    title: "Linear Algebra",
  },
  {
    type: "Literature",
    duration: 10,
    fees: 129.99,
    enrollment: "open",
    title: "World Literature",
  },
  {
    type: "Computer Science",
    duration: 12,
    fees: 149.99,
    enrollment: "closed",
    title: "Software Engineering Principles",
  },
];

function iterateAndAddCourses(data) {
  data.forEach(async (course) => {
    await AddCourse(course);
  });
}

iterateAndAddCourses(data);
