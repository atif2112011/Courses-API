const sql = require("./sql");

// Add New User
exports.AddNewUser = async (data) => {
  const user = {
    name: data.name,
    password: data.password,
    email: data.email,
    age: null,
    phone: null,
    gender: "male",
    pfp: "https://res.cloudinary.com/dufl26uv9/image/upload/v1691905656/zhnpoppaufp7tircsqm5.png",
  };
  try {
    const response = await sql`INSERT INTO users ${sql(user)} returning *`;

    return {
      status: true,
      data: response,
    };
  } catch (error) {
    console.log(error.message);
    return {
      status: false,
      error: error.message,
    };
  }
};

//Get User By USerID
exports.GetUserByID = async (data) => {
  const query = {
    id: data.id,
  };
  try {
    const response = await sql`SELECT * FROM users WHERE id=${query.id}`;

    return {
      status: true,
      data: response,
    };
  } catch (error) {
    console.log(error.message);
    return {
      status: false,
      error: error.message,
    };
  }
};

// Get User By Email
exports.GetUserByEmail = async (data) => {
  const query = {
    email: data.email,
  };

  try {
    const response = await sql`SELECT * FROM users WHERE email=${query.email}`;

    return {
      status: true,
      data: response,
    };
  } catch (error) {
    console.log(error.message);
    return {
      status: false,
      error: error.message,
    };
  }
};

exports.UpdateUser = async (data) => {
  console.log("data received in db", data);
  const user = {
    id: data.id,
    name: data.name || "",
    email: data.email || "",
    age: data.age || 0,
    phone: data.phone || "",
    gender: data.gender || "",
    pfp:
      data.pfp ||
      "https://res.cloudinary.com/dufl26uv9/image/upload/v1691905656/zhnpoppaufp7tircsqm5.png",
  };

  const columns = [];

  for (let key in data) {
    if (key !== "id" && data[key] != "null") {
      columns.push(key);
    }
  }

  console.log(columns);

  try {
    const response = await sql`
      update users set ${sql(user, columns)}
      where id = ${user.id}
    `;

    return {
      status: true,
      data: response,
    };
  } catch (error) {
    console.log(error.message);
    return {
      status: false,
      error: error.message,
    };
  }
};

//Add New Course
exports.AddCourse = async (data) => {
  const course = {
    type: data.type || "Computer Science",
    duration: data.duration || "12",
    fees: data.fees || "0",
    enrollment: data.enrollment || "open",
    title: data.title || "Default Title",
  };
  try {
    const response = await sql`INSERT INTO courses ${sql(course)} returning *`;

    return {
      status: true,
      data: response,
    };
  } catch (error) {
    console.log(error.message);
    return {
      status: false,
      error: error.message,
    };
  }
};

//Get Courses
exports.GetCourses = async (data) => {
  console.log(`QUery Recieved`, data);
  try {
    const response = await sql`SELECT * from courses ${
      data.type && data.type !== "all"
        ? sql`WHERE type = ${data.type}`
        : sql`WHERE 1=1`
    } ${
      data.fee
        ? sql`AND fees >= ${data.fee.min} and fees <= ${data.fee.max}`
        : sql``
    } 
    ${
      data.duration
        ? sql`AND duration >= ${data.duration.min} and duration <= ${data.duration.max}`
        : sql``
    }
    ${
      data.enrollment && data.enrollment !== "all"
        ? sql`AND enrollment = ${data.enrollment}`
        : sql``
    } `;

    return {
      status: true,
      data: response,
    };
  } catch (error) {
    console.log(error.message);
    return {
      status: false,
      error: error.message,
    };
  }
};
