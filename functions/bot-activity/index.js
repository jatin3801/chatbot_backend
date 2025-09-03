const { getBotActivity } = require("./service");

module.exports.handler = async (event) => {
  try {
    const token =
      event?.headers?.Authorization || event?.headers?.authorization;

    // Extract query parameters
    const { bot_id, start_date, end_date } = event.queryStringParameters || {};

    // Check if token and bot_id are provided
    if (!token) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Token is required" }),
      };
    }

    if (!bot_id) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "bot_id is required" }),
      };
    }

    // Fetch bot activity
    const data = await getBotActivity({ token, bot_id, start_date, end_date });

    // Handle errors returned from getBotActivity
    if (data.statusCode && data.statusCode !== 200) {
      return {
        statusCode: data.statusCode,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: data.message }),
      };
    }

    // Successful response
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data), // Directly return the data without wrapping in another message
    };
  } catch (error) {
    console.log("Error occurred:", error);

    // Handle specific known error types
    if (error.name === "TokenExpiredError") {
      return {
        statusCode: 401,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Token has expired" }),
      };
    } else if (
      error.name === "JsonWebTokenError" ||
      error.message === "Invalid token"
    ) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Invalid token" }),
      };
    }

    // Generic error handler
    return {
      statusCode: error.statusCode || 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: error.message || "Internal Server Error",
      }),
    };
  }
};
