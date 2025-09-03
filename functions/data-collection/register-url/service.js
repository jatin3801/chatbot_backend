const { dbPool } = require("./lib/pg");

const registerUrl = async (bot_id, url) => {
  const client = await dbPool.connect();
  try {
    const result = await client.query(
      "INSERT INTO bot_documents (bot_id,url)  VALUES ($1,$2) RETURNING bot_document_id;",
      [bot_id, url]
    );
    console.log("result-->", result);
    return result.rows[0].bot_document_id;
  } catch (error) {
    console.error(error);
  } finally {
    client.release();
  }
};

module.exports = {
  registerUrl,
};
