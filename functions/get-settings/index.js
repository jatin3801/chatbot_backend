const { getUserSettings } = require("./service");

module.exports.handler = async (event) => {
  try {
    const token = event.headers.Authorization || event.headers.authorization;
    const bot_id = event?.queryStringParameters?.bot_id;
    if (!token) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "token is required" }),
      };
    }
    if (!bot_id) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "bot_id is required" }),
      };
    }
    const data = await getUserSettings({ token, bot_id });
    if (data && data.statusCode && data.statusCode !== 200) {
      return {
        statusCode: data.statusCode,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: data.message || " fetching settings failed",
        }),
      };
    }
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: " fetch settings successsfully",
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
