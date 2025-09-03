const jwt = require("jsonwebtoken");

async function checkAuth(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded && decoded.exp) {
      const currentTime = Math.floor(Date.now() / 1000);

      if (decoded.exp < currentTime) {
        return { statusCode: 401, message: "Token is expired" };
      }
    } else {
      return {
        statusCode: 400,
        message: "Invalid token or no expiration time found",
      };
    }
    return decoded;
  } catch (error) {
    return {
      statusCode: 400,
      message: error,
    };
  }
}

module.exports = {
  checkAuth,
};
