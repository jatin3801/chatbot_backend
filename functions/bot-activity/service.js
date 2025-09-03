const { checkAuth } = require("./check-auth");
const { dbPool } = require("./lib/pg");

async function getBotActivity({ token, bot_id, start_date, end_date }) {
  const client = await dbPool.connect();
  try {
    const data = await checkAuth(token);
    if (data.statusCode === 400) {
      throw new Error("Invalid token");
    }
    const res = await client.query(
      `SELECT 
          session_id, 
          STRING_AGG(query, ' | ' ORDER BY timestamp) AS queries, 
          STRING_AGG(result, ' | ' ORDER BY timestamp) AS results,
          MAX(timestamp) AS last_activity
      FROM bot_conversation_logs
      WHERE 
          bot_id = $1 
          AND DATE(timestamp) BETWEEN $2 AND $3
      GROUP BY 
          session_id
      ORDER BY 
          last_activity DESC;  -- Sort by latest activity
      `,
      [bot_id, start_date, end_date]
    );

    const formattedSessions = res.rows.map((session) => {
      const queriesArray = session.queries.split(" | ");
      const resultsArray = session.results.split(" | ");

      const queryResultPairs = queriesArray.map((query, index) => ({
        query,
        result: resultsArray[index],
      }));

      return {
        session_id: session.session_id,
        queryResultPairs,
      };
    });
    return {
      bot_id,
      sessions: formattedSessions,
    };
  } catch (error) {
    console.log("err-->", error);
    if (error.message === "Invalid token") {
      return { statusCode: 400, message: "Invalid token" };
    } else if (error.name === "TokenExpiredError") {
      return { statusCode: 401, message: "Token has expired" };
    } else {
      return { statusCode: 500, message: "Internal Server Error" };
    }
  }
}

module.exports = { getBotActivity };
