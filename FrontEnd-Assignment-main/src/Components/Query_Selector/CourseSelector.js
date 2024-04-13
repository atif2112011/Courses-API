import React, { useState } from "react";
import { GetCourses } from "../../AxiosCalls/courses";

const CourseSelector = ({ courses, setCourses }) => {
  const [query, setQuery] = useState({
    type: "",
    fee: { min: 0, max: 300 },
    duration: { min: 0, max: 12 },
    enrollment: "",
  });

  const handleTypeChange = (e) => {
    setQuery({ ...query, type: e.target.value });
  };

  const handleFeeChange = (e) => {
    setQuery({
      ...query,
      fee: { ...query.fee, [e.target.name]: parseInt(e.target.value) },
    });
  };

  const handleDurationChange = (e) => {
    setQuery({
      ...query,
      duration: {
        ...query.duration,
        [e.target.name]: parseInt(e.target.value),
      },
    });
  };

  const handleEnrollmentChange = (e) => {
    setQuery({ ...query, enrollment: e.target.value });
  };

  const handleSearch = async () => {
    // Your search logic here
    const response = await GetCourses(query);
    if (response.status) {
      console.log(`Response`, response.data);
      await setCourses(response.data);
    }
  };

  return (
    <div>
      <label>Type:</label>
      <div>
        <input
          type="radio"
          id="computerScience"
          name="type"
          value="Computer Science"
          onChange={handleTypeChange}
        />
        <label htmlFor="computerScience">Computer Science</label>
      </div>
      <div>
        <input
          type="radio"
          id="literature"
          name="type"
          value="Literature"
          onChange={handleTypeChange}
        />
        <label htmlFor="literature">Literature</label>
      </div>
      <div>
        <input
          type="radio"
          id="mathematics"
          name="type"
          value="Mathematics"
          onChange={handleTypeChange}
        />
        <label htmlFor="mathematics">Mathematics</label>
      </div>
      <div>
        <input
          type="radio"
          id="allType"
          name="type"
          value="all"
          onChange={handleTypeChange}
        />
        <label htmlFor="allType">All</label>
      </div>

      <label>Fee:</label>
      <input
        type="range"
        name="min"
        min="0"
        max="300"
        value={query.fee.min}
        onChange={handleFeeChange}
      />
      <input
        type="range"
        name="max"
        min="0"
        max="300"
        value={query.fee.max}
        onChange={handleFeeChange}
      />

      <label>Duration (weeks):</label>
      <input
        type="range"
        name="min"
        min="0"
        max="12"
        value={query.duration.min}
        onChange={handleDurationChange}
      />
      <input
        type="range"
        name="max"
        min="0"
        max="12"
        value={query.duration.max}
        onChange={handleDurationChange}
      />

      <label>Enrollment:</label>
      <div>
        <input
          type="radio"
          id="open"
          name="enrollment"
          value="open"
          onChange={handleEnrollmentChange}
        />
        <label htmlFor="open">Open</label>
      </div>
      <div>
        <input
          type="radio"
          id="closed"
          name="enrollment"
          value="closed"
          onChange={handleEnrollmentChange}
        />
        <label htmlFor="closed">Closed</label>
      </div>
      <div>
        <input
          type="radio"
          id="all"
          name="enrollment"
          value="all"
          onChange={handleEnrollmentChange}
        />
        <label htmlFor="all">All</label>
      </div>

      <button onClick={handleSearch}>Modify Search</button>

      <div>
        <strong>Query:</strong> {JSON.stringify(query)}
      </div>
    </div>
  );
};

export default CourseSelector;
