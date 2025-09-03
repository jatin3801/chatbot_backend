const { checkAuth } = require("./check-auth");
const { dbPool } = require("./lib/pg");

async function getUserSettings({ token, bot_id }) {
  const client = await dbPool.connect();
  try {
    const data = await checkAuth(token);
    if (data.statusCode === 400) {
      throw new Error("Invalid token");
    }
    const res = await client.query(
      `SELECT instructions,temperature,color_schema,suggested_questions
       FROM bots b
       WHERE b.bot_id = $1`,
      [bot_id]
    );

    // Check if the bot was found
    if (res.rows.length === 0) {
      return { statusCode: 404, message: "bot not found" };
    }
    const result = res.rows[0];
    return { statusCode: 200, data: result };
  } catch (error) {
    console.error("Error bots:", error);

    // Handle specific error cases
    if (error.message === "Invalid token") {
      return { statusCode: 400, message: "Invalid token" };
    } else if (error.name === "TokenExpiredError") {
      return { statusCode: 401, message: "Token has expired" };
    } else if (error.message === "bot not found") {
      return { statusCode: 404, message: "Bot not found" };
    } else {
      // Handle any other errors
      return { statusCode: 500, message: "Internal Server Error" };
    }
  } finally {
    client.release();
  }
}

module.exports = {
  getUserSettings,
};
