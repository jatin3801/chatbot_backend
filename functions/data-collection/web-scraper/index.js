const { loadWebData } = require("./service");

module.exports.handler = async (event) => {
  try {
    const bot_document_id = event.queryStringParameters.bot_document_id;
    const url = event.queryStringParameters.url;
    const scrapedData = await loadWebData(bot_document_id, url);
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: scrapedData,
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Internal Server Error",
      }),
    };
  }
};
