const { getApiData } = require("./service");

module.exports.handler = async (event) => {
  try {
    const requestBody = JSON.parse(event.body);
    const { bot_id, session_id, query } = requestBody;

    if (!bot_id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "bot_id is required" }),
      };
    }

    if (!session_id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "session_id is required" }),
      };
    }

    const data = await getApiData({ bot_id, session_id, query });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: data }),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid request body" }),
    };
  }
};
