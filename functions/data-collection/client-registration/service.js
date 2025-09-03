const { dbPool } = require("./lib/pg");
const bcrypt = require("bcryptjs");

const registerClient = async (client_name, client_email, password) => {
  const client = await dbPool.connect();
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const result = await client.query(
      "INSERT INTO clients (client_name,client_email,password,created_at) VALUES ($1,$2,$3,NOW()) RETURNING client_id;",
      [client_name, client_email, hashedPassword]
    );
    return result.rows[0].client_id;
  } catch (error) {
    console.error(error);
  } finally {
    client.release();
  }
};
const checkClientRegistration = async (client_email) => {
  const client = await dbPool.connect();
  try {
    const result = await client.query(
      "SELECT * FROM clients WHERE client_email = $1;",
      [client_email]
    );
    if (result.rows.length > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
  } finally {
    client.release();
  }
};

module.exports = {
  checkClientRegistration,
  registerClient,
};
