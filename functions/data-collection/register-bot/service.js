const { dbPool } = require("./lib/pg");

const registerBot = async (
  client_id,
  bot_name,
  color_schema,
  suggested_questions
) => {
  const client = await dbPool.connect();
  try {
    const result = await client.query(
      "INSERT INTO bots (client_id,color_schema,suggested_questions,bot_name) VALUES ($1,$2,$3,$4) RETURNING bot_id;",
      [client_id, color_schema, suggested_questions, bot_name]
    );
    return result.rows[0].bot_id;
  } catch (error) {
    console.error(error);
  } finally {
    client.release();
  }
};

const getRegisterClient = async (client_id) => {
  const client = await dbPool.connect();
  const res = await client.query(
    `SELECT client_id 
         FROM clients
         WHERE client_id = $1;`,
    [client_id]
  );

  if (res.rows.length > 0) {
    return true;
  } else {
    return false;
  }
};

module.exports = {
  registerBot,
  getRegisterClient,
};
