
## Features

### UserAPI

- CRUD operations for managing user data.
- Robust error handling for ensuring data integrity and security.

### Courses API

- CRUD operations for managing course data.
- Admin control features for course management.

### Enrollment API

- Add enrollment with validation to prevent duplicate enrollments by the same user.

### Filters and Pagination

- Filtering implemented using SQL filters for efficient data retrieval.
- Pagination functionality integrated into the frontend for better user experience.

### Email Integration

- Configuration of environment variables to receive emails.
  - Example:
    ```
    RESEND_API=resend_key
    RESEND_EMAIL=yourmail@gmail.com
    ```

### Security

- Admin protection using authentication mechanisms.
- JWT-based login implementation.
- Passwords stored securely as hashes for enhanced security.

### Error Handling and Logging

- Robust error handling to manage exceptions and ensure smooth operation.
- Logging of errors and requests in the `combined.log` file for debugging and analysis.


