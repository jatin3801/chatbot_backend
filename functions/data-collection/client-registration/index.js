const { registerClient, checkClientRegistration } = require("./service");

module.exports.handler = async (event) => {
  try {
    const { client_name, client_email, password } = JSON.parse(
      event.body || "{}"
    );
    if (!client_name || !client_email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "client_name, client_email and password are required",
        }),
      };
    }
    const clientAlreadyExists = await checkClientRegistration(client_email);
    if (clientAlreadyExists) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Client with this E-Mail Id is already registered",
        }),
      };
    }
    const clientID = await registerClient(client_name, client_email, password);
    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "Client with id " + clientID + " registered successfully",
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
