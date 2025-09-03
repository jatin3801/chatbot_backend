const { checkAuth } = require("./check-auth");
const { postSettings } = require("./service");

module.exports.handler = async (event) => {
  try {
    const requestBody = JSON.parse(event.body);
    const token = event.headers.Authorization || event.headers.authorization;
    console.log("token-->", token);

    if (!token) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "token is required" }),
      };
    }
    const data = await checkAuth(token);
    if (data.statusCode && data.statusCode !== 200) {
      throw new Error(data.message);
    }

    const {
      bot_id,
      instructions,
      temperature,
      color_schema,
      suggested_questions,
    } = requestBody;
    if (!bot_id) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "bot_id is required" }),
      };
    }

    // Updating Instructions/Prompt
    const result = await postSettings({
      bot_id,
      instructions,
      temperature,
      color_schema,
      suggested_questions,
    });
    if (result.statusCode && result.statusCode !== 200) {
      throw new Error(result.message);
    }
    // Return success response
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Bot settings updated successfully",
        data: result?.data,
      }),
    };
  } catch (error) {
    // Handle specific known error types
    if (error.message === "TokenExpiredError: jwt expired") {
      return {
        statusCode: 401,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Token has expired" }),
      };
    } else if (
      error.name === "JsonWebTokenError" ||
      error.message === "JsonWebTokenError: invalid token"
    ) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Invalid token" }),
      };
    } else if (error.message === "Bot not found") {
      return {
        statusCode: 404,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Bot not found" }),
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
