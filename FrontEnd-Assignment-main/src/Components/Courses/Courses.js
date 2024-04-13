import React, { useDebugValue, useEffect, useState } from "react";
import coursesData from "./ds.js";
import "./Courses.css";
import CourseSelector from "../Query_Selector/CourseSelector.js";
import { GetCourses } from "../../AxiosCalls/courses.js";
function CourseCard({ course, onEnroll }) {
  const [enrolled, setEnrolled] = useState(false);

  const handleEnroll = () => {
    setEnrolled(true);
    onEnroll(course); // Callback to notify parent component about enrollment
  };

  return (
    <div className="card">
      <h3>{course.title}</h3>
      <table>
        <tbody>
          <tr>
            <td>
              <strong>Type:</strong>
            </td>
            <td>{course.type}</td>
          </tr>
          <tr>
            <td>
              <strong>Duration:</strong>
            </td>
            <td>{course.duration}</td>
          </tr>
          <tr>
            <td>
              <strong>Fees:</strong>
            </td>
            <td>{course.fees}</td>
          </tr>
          <tr>
            <td>
              <strong>Enrollment:</strong>
            </td>
            <td>{course.enrollment}</td>
          </tr>
        </tbody>
      </table>
      {!enrolled && <button onClick={handleEnroll}>Enroll</button>}
      {enrolled && <span>Enrolled!</span>}
    </div>
  );
}

function Courses() {
  const [courses, setCourses] = useState([]);
  const [userCourses, setUserCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 8;

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };
  const handleEnroll = (course) => {
    setUserCourses([...userCourses, course]);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const filteredCourses = coursesData.filter((course) =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setCourses(filteredCourses);
    setSearchQuery("");
  };

  useEffect(async () => {
    const response = await GetCourses();
    if (response.status) {
      setCourses(response.data);
      console.log(response.data);
    } else console.log(`ERror`, response.message);

    const totalPages = Math.ceil(courses.length / coursesPerPage);
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, []);

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);
  return (
    <div className="content">
      <div className="search-content">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a course..."
          />
          <button type="submit">Search</button>
        </form>
      </div>
      <div className="query">
        <CourseSelector courses={courses} setCourses={setCourses} />
      </div>
      <div id="section">
        {/* {courses.map((course) => (
          <CourseCard key={course.id} course={course} onEnroll={handleEnroll} />
        ))} */}
        {currentCourses.map((course) => (
          <CourseCard key={course.id} course={course} onEnroll={handleEnroll} />
        ))}
      </div>

      <button onClick={prevPage} disabled={currentPage === 1}>
        Previous Page
      </button>
      <span className="page-number">Page {currentPage}</span>
      <button onClick={nextPage} disabled={indexOfLastCourse >= courses.length}>
        Next Page
      </button>
      <div className="MyCourses">
        <h2>User Courses</h2>
        <ul>
          {userCourses.map((course) => (
            <li key={course.id}>{course.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Courses;
