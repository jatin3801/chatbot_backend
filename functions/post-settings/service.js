const { dbPool } = require("./lib/pg");
async function postSettings({
  bot_id,
  instructions,
  temperature,
  color_schema,
  suggested_questions,
}) {
  const client = await dbPool.connect();
  try {
    const res = await client.query(
      `UPDATE bots
      SET instructions = $2, temperature = $3,color_schema=$4,suggested_questions=$5
      WHERE bot_id = $1
       RETURNING bot_id; `,
      [bot_id, instructions, temperature, color_schema, suggested_questions]
    );
    if (res.rowCount === 0) {
      return { statusCode: 404, message: "Bot not found" };
    }

    return { statusCode: 200, data: res.rows[0] };
  } catch (error) {
    console.error("Error fetching client and bots:", error);
    return { statusCode: 500, message: "Internal Server Error" };
  } finally {
    client.release();
  }
}

module.exports = {
  postSettings,
};
