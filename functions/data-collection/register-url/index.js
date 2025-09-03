const { registerUrl } = require("./service");

module.exports.handler = async (event) => {
  try {
    const { bot_id, url } = JSON.parse(event.body || "{}");
    if (!bot_id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "bot_id is required" }),
      };
    }
    const botID = await registerUrl(bot_id, url);
    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "Url with id " + botID + " registered successfully",
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
