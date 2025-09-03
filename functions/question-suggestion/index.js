const { getSuggestionQuestions } = require("./service");

module.exports.handler = async (event) => {
  try {
    const bot_id = event.queryStringParameters.bot_id;

    if (!bot_id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "bot_id is required" }),
      };
    }

    const data = await getSuggestionQuestions({ bot_id });
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
