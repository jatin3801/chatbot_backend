const { registerBot, getRegisterClient } = require("./service");

module.exports.handler = async (event) => {
  try {
    const { client_id, bot_name, color_schema, suggested_questions } =
      JSON.parse(event.body || "{}");

    if (!client_id || !bot_name) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "client_id and bot_name are  required",
        }),
      };
    }
    const clientExists = await getRegisterClient(client_id);
    console.log("client_exits-->", clientExists);

    if (!clientExists) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "client is not registered" }),
      };
    }
    const botID = await registerBot(
      client_id,
      bot_name,
      color_schema,
      suggested_questions
    );
    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "Bot with id " + botID + " registered successfully",
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
