const winston = require("winston");

// Define logger configuration
const logger = winston.createLogger({
  level: "info", // Set the minimum log level to info
  format: winston.format.json(), // Log messages in JSON format
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }), // Log errors to error.log
    new winston.transports.File({ filename: "combined.log" }), // Log everything else to combined.log
  ],
});

// If in development environment, also log to console
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

module.exports = logger;
