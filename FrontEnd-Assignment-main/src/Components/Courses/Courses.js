import React, { useState, useEffect } from "react";
import coursesData from "./ds.js";
import "./Courses.css";
import CourseSelector from "../Query_Selector/CourseSelector.js";
import { GetCourses } from "../../AxiosCalls/courses.js";
import {
  AddEnrollment,
  getUserEnrollment,
} from "../../AxiosCalls/enrollment.js";
import SpinnerComponent from "../Spinner/spinner.js";
import basestyle from "../Base.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';

function CourseCard({ course, onEnroll, userProfile, setUserCourses }) {
  const [enrolled, setEnrolled] = useState(false);

  const handleEnroll = async (course_id, course_title) => {
    // Callback to notify parent component about enrollment
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let currentDate = `${year}-${month}-${day}`;

    const response = await AddEnrollment({
      user_id: userProfile.id,
      course_id: course_id,
      course_title: course_title,
      user_name: userProfile.fname,
      enrollment_date: currentDate,
    });

    if (response.status) {
      alert(response.message);
      const userEnrolledCourses = await getUserEnrollment({
        user_id: userProfile.id,
      });
      await setUserCourses(userEnrolledCourses.data);
    } else {
      alert(response.message);
    }
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
      {!enrolled && (
        <button className={basestyle.button_common} onClick={() => handleEnroll(course.id, course.title)}>
          Enroll
        </button>
      )}
      {enrolled && <span>Enrolled!</span>}
    </div>
  );
}

function Courses({ userProfile }) {
  const [courses, setCourses] = useState([]);
  const [userCourses, setUserCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loader, setLoader] = useState(false);
  const [showUserCourses, setShowUserCourses] = useState(false); // State to manage visibility of user enrolled courses

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
    const filteredCourses = courses.filter((course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setCourses(filteredCourses);
    setSearchQuery("");
    setCurrentPage(1);
  };

  useEffect(async () => {
    await setLoader(true);
    const userEnrolledCourses = await getUserEnrollment({
      user_id: userProfile.id,
    });
    await setUserCourses(userEnrolledCourses.data);

    const response = await GetCourses();
    if (response.status) {
      setCourses(response.data);
      console.log(response.data);
    } else {
      console.log(`Error`, response.message);
    }

    const totalPages = Math.ceil(courses.length / coursesPerPage);
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
    setCurrentPage(1);
    await setLoader(false);
  }, []);

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);

  return (
    <div className="content">
      {loader && <SpinnerComponent />}
      <div className="search-content">
        <form onSubmit={handleSearch}>
          <input
            style={{ height: "30px" }}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a course..."
          />
          <button className={basestyle.button_common}>Search</button>
        </form>
      </div>
      <div className="query">
        <CourseSelector
          courses={courses}
          setCourses={setCourses}
          setCurrentPage={setCurrentPage}
        />
      </div>
      <div id="section">
        {currentCourses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            onEnroll={handleEnroll}
            userProfile={userProfile}
            setUserCourses={setUserCourses}
          />
        ))}
      </div>
      <span className="page-number">Page {currentPage}</span>
      <div className="navigate-butt">
        <button className={basestyle.button_common} onClick={prevPage} disabled={currentPage === 1}>
          Previous Page <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        
        <button
          className={basestyle.button_common}
          onClick={nextPage}
          disabled={indexOfLastCourse >= courses.length}
        >
          Next Page <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>
      <div className="MyCourses">
        <button className={basestyle.button_common} onClick={() => setShowUserCourses(!showUserCourses)}>
           Enrolled Courses
        </button>
        {showUserCourses && (
          <>
            <div className="cards_enrolled">
              {userCourses.map((course) => (
                <div className="card" key={course.id}>
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
                          <strong>Enrolled On: </strong>
                        </td>
                        <td>{course.enrollment_date.slice(0, 10)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

    </div>
  );
}

export default Courses;
