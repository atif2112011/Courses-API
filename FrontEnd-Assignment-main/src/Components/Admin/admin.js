import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import {
  AddCourse,
  DeleteCourse,
  GetCourses,
  UpdatedCourse,
} from "../../AxiosCalls/courses";
import { ValidateToken } from "../../AxiosCalls/users";
import SpinnerComponent from "../Spinner/spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import basestyle from "../Base.module.css";
import "./admin.css";
const inputStyle = {
  padding: "10px",
  marginBottom: "10px",
  border: "1px solid #ccc",
  borderRadius: "5px",
  marginRight: "10px",
  textAlign: "left", // Ensure text alignment is left
  paddingLeft: "5px", // Add padding to the left for placeholder alignment
};

const buttonStyle = {
  // padding: "10px",
  border: "none",
  borderRadius: "5px",
  backgroundColor: "#007bff",
  color: "#fff",
  cursor: "pointer",
  marginTop: "10px",
  height: "45px",

  // width: "0px",
};

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "30%",
  },
};
const AdminPanel = () => {
  const [courses, setCourses] = useState([]);
  const [tokenPresent, setTokenPresent] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage] = useState(5);
  const [userState, setUserState] = useState({});
  const [modalIsOpen, setIsOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false); // State for showing/hiding the add course form
  const [newCourseData, setNewCourseData] = useState({
    title: "",
    type: "",
    duration: "duration",
    fees: "fees",
    enrollment: "closed", // Default enrollment status
  });
  const [editCourse, setEditCourse] = useState({
    id: null,
    title: "",
    type: "",
    duration: 0,
    fees: 0,
    enrollment: "open", // Default value for enrollment
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

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const toggleEnrollment = async (id, enrollment) => {
    // Implement your logic to toggle enrollment status for a course
    await setLoader(true);
    const response = await UpdatedCourse({
      id: id,
      enrollment: enrollment === "closed" ? "open" : "closed",
    });

    if (response.status) {
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
    }
    console.log(response);
    await setLoader(false);
    // Find the course by id
  };

  const handleEditCourse = (e) => {
    const { name, value } = e.target;
    setEditCourse((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleEdit = async (course) => {
    // Implement your edit logic
    await setEditCourse(course);
    await setIsOpen(true);
  };

  const handleDelete = async (id) => {
    // Implement your delete logic
    await setLoader(true);
    const response = await DeleteCourse({
      id: id,
    });

    if (response.status) {
      alert("Course Deleted Successfully");
      const updatedCourses = courses.filter((course) => course.id !== id);
      await setCourses(updatedCourses);
      await setLoader(false);
    } else {
      alert(response.message);
      await setLoader(false);
    }
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
      [name]: value,
    }));
  };
  const handleEditFormSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission, e.g., send data to backend
    console.log(editCourse);
    await setLoader(true);
    const response = await UpdatedCourse(editCourse);
    if (response.status) {
      const indexToUpdate = courses.findIndex(
        (course) => course.id === editCourse.id
      );

      if (indexToUpdate !== -1) {
        // Create a copy of the courses array
        const updatedCourses = [...courses];

        // Update the course object at the specified index
        updatedCourses[indexToUpdate] = editCourse;

        // Set the state with the updated courses array
        setCourses(updatedCourses);
      }
      await setLoader(false);
      await closeModal();
      alert("Course Updated Successfully");
    } else {
      alert(response.message);
      await setLoader(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Ensure duration and fees are not less than 0
    await setLoader(true);
    if (newCourseData.duration < 0 || newCourseData.fees < 0) {
      alert("Values cant be negative");
      await setLoader(false);
    } else {
      const response = await AddCourse({
        title: e.target.title.value,
        type: e.target.type.value,
        enrollment: e.target.enrollment.value,
        duration: e.target.duration.value,
        fees: e.target.fees.value,
      });

      if (response.status) {
        alert(response.message);
        setShowAddForm(false);
        await setCourses([...courses, response.data]);
        await setLoader(false);
      } else {
        alert(response.message);
        await setLoader(false);
      }
    }
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
      {modalIsOpen && (
        <Modal
          isOpen={modalIsOpen}
          // onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <h3>Update Course</h3>
          <form className="edit_form" onSubmit={handleEditFormSubmit}>
            <label htmlFor="title">Course Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={editCourse.title}
              onChange={handleEditCourse}
            />

            <label htmlFor="type">Course Type:</label>
            <input
              type="text"
              id="type"
              name="type"
              value={editCourse.type}
              onChange={handleEditCourse}
            />

            <label htmlFor="duration">Course Duration (months):</label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={editCourse.duration}
              onChange={handleEditCourse}
            />

            <label htmlFor="fees">Course Fees:</label>
            <input
              type="number"
              id="fees"
              name="fees"
              value={editCourse.fees}
              onChange={handleEditCourse}
            />

            <label>Course Enrollment:</label>
            <label htmlFor="open">Open</label>
            <input
              type="radio"
              id="open"
              name="enrollment"
              value="open"
              checked={editCourse.enrollment === "open"}
              onChange={handleEditCourse}
            />
            <label htmlFor="closed">Closed</label>
            <input
              type="radio"
              id="closed"
              name="enrollment"
              value="closed"
              checked={editCourse.enrollment === "closed"}
              onChange={handleEditCourse}
            />
            <div>
              <button type="submit">Submit</button>
              <button onClick={closeModal}>Close</button>
            </div>
          </form>
        </Modal>
      )}
      {tokenPresent ? (
        <div>
          <button className={basestyle.button_common} onClick={handleAddCourse}>
            Add Course
          </button>
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
              <button
                className={basestyle.button_common}
                type="submit"
                style={buttonStyle}
              >
                Submit
              </button>
            </form>
          )}
          <button
            className={basestyle.button_common}
            onClick={() => {
              navigate("/"); // Navigate to /admin route
            }}
            style={{
              position: "absolute",
              top: 0,
              backgroundColor: "olivedrab",
              color: "white",
              padding: "15px 30px",
              fontSize: "22px",
              // margin: "5rem",
              // height: "55px",
              right: "200px",
              width: "150px",
              border: "none",
              borderRadius: "10px",
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
                    <button
                      className={basestyle.button_common}
                      onClick={() =>
                        toggleEnrollment(course.id, course.enrollment)
                      }
                    >
                      {course.enrollment === "closed" ? "Open" : "Close"}
                    </button>
                  </td>
                  <td>
                    <button
                      className={basestyle.button_common}
                      onClick={() => handleEdit(course)}
                    >
                      Edit
                    </button>
                  </td>
                  <td>
                    <button
                      className={basestyle.button_common}
                      onClick={() => handleDelete(course.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <span className="page-number">{`Page ${currentPage}`}</span>
          <div className="navigator">
            <button
              className={basestyle.button_common}
              onClick={prevPage}
              disabled={currentPage === 1}
            >
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
