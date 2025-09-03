const { getAuthResult } = require("./service");

module.exports.handler = async (event) => {
  try {
    const requestBody = JSON.parse(event.body);

    // Validate input
    const { email, password } = requestBody;
    if (!email || !password) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Email and password are required" }),
      };
    }

    // Attempt to get authentication result
    const data = await getAuthResult({ email, password });

    // Handle non-successful responses from getAuthResult
    if (data && data.statusCode && data.statusCode !== 200) {
      return {
        statusCode: data.statusCode,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: data.message || "Authentication failed",
        }),
      };
    }

    // Return success response
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Client fetched successfully",
        data: data,
      }),
    };
  } catch (error) {
    // Log error for debugging
    console.error("Error occurred:", error);

    // Handle system errors
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal server error";

    return {
      statusCode: statusCode,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    };
  }
};
