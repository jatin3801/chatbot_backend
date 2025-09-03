const { getUserDetails } = require("./service");

module.exports.handler = async (event) => {
  try {
    const token = event.headers.Authorization || event.headers.authorization;
    if (!token) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "token is required" }),
      };
    }
    const data = await getUserDetails({ token });
    if (data && data.statusCode && data.statusCode !== 200) {
      return {
        statusCode: data.statusCode,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: data.message || "Authentication failed",
        }),
      };
    }
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Client fetched succesfully",
        data: data?.data,
      }),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid request" }),
    };
  }
};
