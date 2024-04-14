import React, { useState, useEffect } from "react";
import { GetCourses } from "../../AxiosCalls/courses";

const AdminPanel = () => {
  const [courses, setCourses] = useState([]);
  const [tokenPresent, setTokenPresent] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage] = useState(5);
  useEffect(async () => {
    const token = localStorage.getItem("token");
    if (token) {
      setTokenPresent(true);
      // Mocking API call with hardcoded data for demonstration
      //   setCourses([
      //     {
      //       id: 1,
      //       type: "Computer Science",
      //       duration: 12,
      //       fees: 149.99,
      //       enrollment: "closed",
      //       title: "Database Management Systems",
      //     },
      //     {
      //       id: 2,
      //       type: "Mathematics",
      //       duration: 10,
      //       fees: 99.99,
      //       enrollment: "open",
      //       title: "Advanced Calculus",
      //     },
      //   ]);

      const response = await GetCourses();
      setCourses(response.data);
    }
  }, []);

  const toggleEnrollment = (id) => {
    // Implement your logic to toggle enrollment status for a course
    const response = await;
  };

  const handleEdit = (id) => {
    // Implement your edit logic
  };

  const handleDelete = (id) => {
    // Implement your delete logic
  };

  const handleAddCourse = () => {
    // Implement your add course logic
  };
  // Get current courses
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(currentPage + 1);
  const prevPage = () => setCurrentPage(currentPage - 1);
  return (
    <div>
      {tokenPresent ? (
        <div>
          <button onClick={handleAddCourse}>Add Course</button>
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
                    <button onClick={() => toggleEnrollment(course.id)}>
                      {course.enrollment === "closed" ? "Open" : "Close"}
                    </button>
                  </td>
                  <td>
                    <button onClick={() => handleEdit(course.id)}>Edit</button>
                  </td>
                  <td>
                    <button onClick={() => handleDelete(course.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <button onClick={prevPage} disabled={currentPage === 1}>
              Previous Page
            </button>
            <span>{`Page ${currentPage}`}</span>
            <button
              onClick={nextPage}
              disabled={currentCourses.length < coursesPerPage}
            >
              Next Page
            </button>
          </div>
        </div>
      ) : (
        <div>Please login to access the admin panel.</div>
      )}
    </div>
  );
};

export default AdminPanel;
