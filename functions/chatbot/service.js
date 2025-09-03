const dotenv = require("dotenv");
dotenv.config();
const { ragChain } = require("./utils/chain");
const { dbPool } = require("./lib/pg.js");

const getApiData = async ({ bot_id, session_id, query }) => {
  const client = await dbPool.connect();

  try {
    const chat_history = await getHistory(client, bot_id, session_id);
    const { bot_document_id, instructions, temperature } =
      await getBotAndDocument(client, bot_id);
    const filter = { bot_document_id };

    console.log("chat_history", chat_history);

    const aiMsg = await ragChain({
      filter,
      question: query,
      chat_history,
      instructions,
      temperature,
    });

    const response = {
      data: aiMsg.content,
      message: "query response fetched successfully",
    };

    // Perform logging asynchronously
    await logConversation(client, bot_id, session_id, query, aiMsg.content);
    
    return response;
  } catch (error) {
    console.log(error);
  } finally {
    client.release();
  }
};

module.exports = { getApiData };

async function getHistory(client, bot_id, session_id) {
  try {
    const res = await client.query(
      `SELECT query, result
       FROM bot_conversation_logs
       WHERE bot_id = $1 AND session_id = $2
       ORDER BY timestamp DESC
       LIMIT 10;
      `,
      [bot_id, session_id]
    );
    return (
      res?.rows?.reverse()?.flatMap((row) => [
        ["human", row.query],
        ["ai", row.result],
      ]) || []
    );
  } catch (error) {
    console.log("err-->", error);
  }
}

async function logConversation(client, bot_id, session_id, query, result) {
  try {
    await client.query(
      `INSERT INTO bot_conversation_logs (bot_id, session_id, query, result, timestamp)
       VALUES ($1, $2, $3, $4, NOW());
      `,
      [bot_id, session_id, query, result]
    );
  } catch (error) {
    console.error(`Error logging conversation: ${error}`);
  }
}

async function getBotAndDocument(client, bot_id) {
  try {
    const res = await client.query(
      `SELECT  * FROM bot_documents
       JOIN bots 
        ON bot_documents.bot_id = bots.bot_id
        WHERE bots.bot_id  = $1;
      `,
      [bot_id]
    );
    return res.rows[0];
  } catch (error) {
    console.log(error);
  }
}
