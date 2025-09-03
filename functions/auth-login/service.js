const bcrypt = require("bcryptjs");
const { dbPool } = require("./lib/pg");
const jwt = require("jsonwebtoken");

async function getAuthResult({ email, password }) {
  const client = await dbPool.connect();
  try {
    const res = await client.query(
      `SELECT c.client_id,c.client_name, c.client_email, c.password,b.bot_id, b.bot_name
       FROM clients c
        LEFT JOIN bots b ON c.client_id = b.client_id
       WHERE c.client_email = $1`,
      [email]
    );
    if (res.rows.length === 0) {
      return { statusCode: 400, message: "Invalid email or password" };
    }
    const user = res.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return { statusCode: 400, message: "Invalid email or password" };
    }
    const token = jwt.sign(
      { clientId: user.client_id, email: user.client_email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const bots = res.rows
      .filter((row) => row.bot_id !== null)
      .map((row) => ({
        bot_id: row.bot_id,
        bot_name: row.bot_name,
      }));
    const result = {
      token,
      tokenExpiresIn: new Date().getTime() + 24 * 60 * 60 * 1000,
      client_id: user.client_id,
      client_name: user.client_name,
      bots: bots,
    };

    return result;
  } catch (error) {
    console.error("Error fetching client and bots:", error);
    return { statusCode: 500, message: "Internal Server Error" };
  } finally {
    client.release();
  }
}

module.exports = {
  getAuthResult,
};
