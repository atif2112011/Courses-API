import React, { useState, useEffect } from "react";
import { GetCourses } from "../../AxiosCalls/courses";
import { ValidateToken } from "../../AxiosCalls/users";
import SpinnerComponent from "../Spinner/spinner";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import basestyle from "../Base.module.css";
import "./admin.css"
const inputStyle = {
  padding: '10px',
  marginBottom: '10px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  textAlign: 'left', // Ensure text alignment is left
  paddingLeft: '5px', // Add padding to the left for placeholder alignment
};

const buttonStyle = {
  padding: '10px',
  border: 'none',
  borderRadius: '5px',
  backgroundColor: '#007bff',
  color: '#fff',
  cursor: 'pointer',
  marginTop: '10px',
};
const AdminPanel = () => {
  const [courses, setCourses] = useState([]);
  const [tokenPresent, setTokenPresent] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage] = useState(5);
  const [userState, setUserState] = useState({});
  const [loader, setLoader] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false); // State for showing/hiding the add course form
  const [newCourseData, setNewCourseData] = useState({
    title: "",
    type: "",
    duration: "duration",
    fees: "fees",
    enrollment: "closed" // Default enrollment status
  });
  useEffect(async () => {
    await setLoader(true);
    const token = localStorage.getItem("token");
    if (token) {
      setTokenPresent(true);
      const checkToken = await ValidateToken({
        token: token,
      });
      if (checkToken.status) {
        const user = {
          fname: checkToken.data.name,
          email: checkToken.data.email,
          id: checkToken.data.id,
          age: checkToken.data.age,
          phone: checkToken.data.phone,
          gender: checkToken.data.gender,
          pfp: checkToken.data.pfp,
          isadmin: checkToken.data.isadmin,
        };
        await setUserState(user);

        if (!checkToken.data.isadmin) {
          await setLoader(false);
          alert("No admin privileges found");
          window.location.href = "/";
        }
      }

      const response = await GetCourses();
      setCourses(response.data);
    }
    await setLoader(false);
  }, []);

  const toggleEnrollment = (id) => {
    // Implement your logic to toggle enrollment status for a course
    // const response = await;
        // Find the course by id
        const updatedCourses = courses.map((course) => {
          if (course.id === id) {
            // Toggle enrollment status
            return {
              ...course,
              enrollment: course.enrollment === "closed" ? "open" : "closed",
            };
          }
          return course;
        });
        // Update courses state
        setCourses(updatedCourses);
  };

  const handleEdit = (id) => {
    // Implement your edit logic
  };

  const handleDelete = (id) => {
    // Implement your delete logic
  };

  
  
  const handleAddCourse = () => {
    setShowAddForm(true); // Show the add course form when button is clicked
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    // Ensure duration and fees are not less than 0
    if ((name === "duration" || name === "fees") && parseFloat(value) < 0) {
      return; // Exit early if value is less than 0
    }
    setNewCourseData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Ensure duration and fees are not less than 0
    if (newCourseData.duration < 0 || newCourseData.fees < 0) {
      return; // Exit early if duration or fees is less than 0
    }
    // Implement your logic to submit the new course data to the database
    // After submitting, you may want to hide the form and update the courses list
    setShowAddForm(false);
  };
  // Get current courses
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);
  const navigate = useNavigate();
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(currentPage + 1);
  const prevPage = () => setCurrentPage(currentPage - 1);

  return (
    <div>
      {loader && <SpinnerComponent />}
      {tokenPresent ? (
        <div>
         <button className={basestyle.button_common} onClick={handleAddCourse} >Add Course</button>
          {showAddForm && (
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="title"
                value={newCourseData.title}
                onChange={handleFormChange}
                placeholder="Course Title"
                style={inputStyle}
                required
              />
              <input
                type="text"
                name="type"
                value={newCourseData.type}
                onChange={handleFormChange}
                placeholder="Course Type"
                style={inputStyle}
                required
              />
              <input
                type="number"
                name="duration"
                value={newCourseData.duration}
                onChange={handleFormChange}
                placeholder="Duration"
                style={inputStyle}
                required
              />
              <input
                type="number"
                name="fees"
                value={newCourseData.fees}
                onChange={handleFormChange}
                placeholder="Fees"
                style={inputStyle}
                required
              />
              <select
                name="enrollment"
                value={newCourseData.enrollment}
                onChange={handleFormChange}
                style={inputStyle}
              >
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
              <button className={basestyle.button_common} type="submit" style={buttonStyle}>Submit</button>

            </form>
          )}
  <button className={basestyle.button_common}
    onClick={() => {
    navigate('/'); // Navigate to /admin route
  }}
  style={{
    position: "absolute",
    top: 0,
    backgroundColor: "olivedrab",
    color: "white",
    padding: "15px 30px",
    fontSize: "22px",
    margin: "1rem",
    height:"70px",
    right: "200px",
    width: "150px",
    border: "none",
    borderRadius: "15px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto",
    marginTop: "10px",
    marginBottom: "10px",
  }}
>
  Home
</button>
          <table>
            <thead>
              <tr>
                <th>Course Title</th>
                <th>Fees</th>
                <th>Duration</th>
                <th>Enrollment</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {currentCourses.map((course) => (
                <tr key={course.id}>
                  <td>{course.title}</td>
                  <td>{course.fees}</td>
                  <td>{course.duration}</td>
                  <td>
                    <button className={basestyle.button_common} onClick={() => toggleEnrollment(course.id)}>
                      {course.enrollment === "closed" ? "Open" : "Close"}
                    </button>
                  </td>
                  <td>
                    <button className={basestyle.button_common} onClick={() => handleEdit(course.id)}>Edit</button>
                  </td>
                  <td>
                    <button  className={basestyle.button_common} onClick={() => handleDelete(course.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <span className="page-number">{`Page ${currentPage}`}</span>
          <div className="navigator">
            <button className={basestyle.button_common} onClick={prevPage} disabled={currentPage === 1}>
              Previous Page <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <div>
            <button
              onClick={nextPage}
              className={basestyle.button_common}
              disabled={currentCourses.length < coursesPerPage}
            >
              Next Page <FontAwesomeIcon icon={faArrowRight} />
            </button>
            </div>
          </div>
        </div>
      ) : (
        <div>Please login to access the admin panel.</div>
      )}
    </div>
  );
};

export default AdminPanel;
