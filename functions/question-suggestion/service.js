const { dbPool } = require("./lib/pg");

async function getSuggestionQuestions({ bot_id }) {
  const client = await dbPool.connect();
  try {
    const res = await client.query(
      `SELECT color_schema, suggested_questions
         FROM bots
         WHERE bot_id = $1
         ;
        `,
      [bot_id]
    );
    return res?.rows;
    ``;
  } catch (error) {
    console.log("err-->", error);
  }
}

module.exports = { getSuggestionQuestions };
