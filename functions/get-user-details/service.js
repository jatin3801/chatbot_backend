const { checkAuth } = require("./check-auth");
const { dbPool } = require("./lib/pg");

async function getUserDetails({ token }) {
  const client = await dbPool.connect();
  try {
    const data = await checkAuth(token);
    if (data.statusCode === 400) {
      throw new Error("Invalid token");
    }
    const res = await client.query(
      `SELECT c.client_id, c.client_name, b.bot_id, b.bot_name
       FROM clients c
       LEFT JOIN bots b ON c.client_id = b.client_id
       WHERE c.client_email = $1`,
      [data?.email]
    );

    // Check if the user was found
    if (res.rows.length === 0) {
      return { statusCode: 404, message: "Client not found" };
    }

    // Extract user and bot details from the query result
    const user = res.rows[0];
    const bots = res.rows
      .filter((row) => row.bot_id !== null)
      .map((row) => ({
        bot_id: row.bot_id,
        bot_name: row.bot_name,
      }));

    // Prepare the response with the user and bot details
    const result = {
      client_id: user.client_id,
      client_name: user.client_name,
      bots: bots,
    };

    return { statusCode: 200, data: result };
  } catch (error) {
    console.error("Error fetching client and bots:", error);

    // Handle specific error cases
    if (error.message === "Invalid token") {
      return { statusCode: 400, message: "Invalid token" };
    } else if (error.name === "TokenExpiredError") {
      return { statusCode: 401, message: "Token has expired" };
    } else if (error.message === "Client not found") {
      return { statusCode: 404, message: "Client not found" };
    } else {
      // Handle any other errors
      return { statusCode: 500, message: "Internal Server Error" };
    }
  } finally {
    client.release();
  }
}

module.exports = {
  getUserDetails,
};
