const { handler: chatbotHandler } = require("./functions/chatbot");
// const { handler: helloHandler } = require("./functions/hello-world/index");
const {
  handler: suggestionHandler,
} = require("./functions/question-suggestion/index");
const {
  handler: botActivityHandler,
} = require("./functions/bot-activity/index");
const { handler: authLoginHandler } = require("./functions/auth-login/index");
const {
  handler: getUserHandler,
} = require("./functions/get-user-details/index");
const {
  handler: postSettingsHandler,
} = require("./functions/post-settings/index");
const {
  handler: getSettingsHandler,
} = require("./functions/get-settings/index");

const {
  handler: registerClientHandler,
} = require("./functions/data-collection/client-registration/index");
const {
  handler: registerBotHandler,
} = require("./functions/data-collection/register-bot/index");
const {
  handler: registerWebScraperHandler,
} = require("./functions/data-collection/web-scraper/index");
const {
  handler: registerUrlHandler,
} = require("./functions/data-collection/register-url/index");

// async function hello() {
//   const response = await helloHandler({
//     queryStringParameters: { Name: "John" },
//   });
//   console.log(response);
// }

async function webScraper(bot_document_id, url) {
  const response = await registerWebScraperHandler({
    queryStringParameters: { bot_document_id, url },
  });
  console.log(response);
}

async function registerClient(client_name, client_email, password) {
  const response = await registerClientHandler({
    body: JSON.stringify({
      client_name,
      client_email,
      password,
    }),
  });
  console.log(response);
}

async function registerBot(id, bot_name, color_schema, suggested_questions) {
  const response = await registerBotHandler({
    body: JSON.stringify({
      client_id: id,
      bot_name: bot_name,
      color_schema: color_schema,
      suggested_questions: suggested_questions,
    }),
  });
  console.log(response);
}

async function registerUrl(bot_id, url) {
  const response = await registerUrlHandler({
    body: JSON.stringify({
      bot_id,
      url,
    }),
  });
  console.log(response);
}
async function chatbot(bot_id, session_id, query) {
  const response = await chatbotHandler({
    body: JSON.stringify({
      bot_id,
      session_id,
      query,
    }),
  });
  console.log(response);
}

async function getSuggestionQuestions(id) {
  const response = await suggestionHandler({
    queryStringParameters: { bot_id: id },
  });
  console.log(response);
}
async function getBotActivity(token, id, start_date, end_date) {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `${token}`,
  };
  const response = await botActivityHandler({
    headers: headers,
    queryStringParameters: { bot_id: id, start_date, end_date },
  });
  console.log(response);
}
async function authLogin(email, password) {
  const response = await authLoginHandler({
    body: JSON.stringify({
      email,
      password,
    }),
  });
  console.log(response);
}
async function getUserDetails(token) {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `${token}`,
  };
  const response = await getUserHandler({
    headers: headers,
  });
  console.log(response);
}
async function postBotSettings(
  token,
  bot_id,
  instructions,
  temperature,
  color_schema,
  suggested_questions
) {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `${token}`,
  };
  const response = await postSettingsHandler({
    headers: headers,
    body: JSON.stringify({
      bot_id,
      instructions,
      temperature,
      color_schema,
      suggested_questions,
    }),
  });
  console.log(response);
}
async function getBotSettings(token, bot_id) {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `${token}`,
  };
  const response = await getSettingsHandler({
    headers: headers,
    queryStringParameters: { bot_id },
  });
  console.log(response);
}

const args = process.argv.slice(2);
const command = args[0];
const name = args[1];

async function main() {
  switch (command) {
    case "chatbot":
      await chatbot(
        "7338aa95-8eac-4920-8e89-6bbbb7965697", //bot id
        "3ec45700-da78-4fcb-96c7-29f98645ce78", //session id
        "do they provide data ops services??" //query
      );
      break;
    case "registerClient":
      await registerClient("Signotech", "Sign318@gmail.com", "Sign@123");
      break;
    case "registerBot":
      await registerBot(
        "f907be5b-46bb-45d2-8f2b-85515cd39658",
        "signotech-site",
        "#3242a8",
        [
          "what is Signotech Infosystem?",
          "what services do they provides?",
          "Who is the color of sky?",
          "Who is the CEO of Ion Infotech?",
          "How to contact them?",
        ]
      );
      break;
    case "registerUrl":
      await registerUrl(
        "51376185-4479-42dd-b434-99862710838c",
        "https://main.dakbgytm7rawr.amplifyapp.com/"
      );
      break;
    case "webScraper":
      await webScraper(
        "42ca5093-76c9-4fff-8b0b-b0cbe0a75a94",
        "https://main.dakbgytm7rawr.amplifyapp.com/"
      );
      break;
    case "suggestion-questions":
      await getSuggestionQuestions("30794a7b-147e-4204-bc93-a4036d929310");
      break;
    case "bot-activity":
      await getBotActivity(
        "eyJhciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRJZCI6Ijg5YmIwODc5LTMzZGQtNDQyZC05Mjk2LTE5OWQ0Yzg2YjhjYyIsImVtYWlsIjoiaW5mb0Bjb21wbGVyZWluZm9zeXN0ZW0uY29tIiwiaWF0IjoxNzI0MzE1MjAzLCJleHAiOjE3MjQ0MDE2MDN9.RiGsE6v8IzN4g7a7UVXnlTJeWiydBQYWVw02l5_HaPE",
        "30794a7b-147e-4204-bc93-a4036d929310",
        "2024-08-10",
        "2024-08-10"
      );
      break;
    case "auth-login":
      await authLogin("info-dev@complereinfosystem.com", "Complere@123");
      break;
    case "get-user":
      await getUserDetails(
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRJZCI6Ijg5YmIwODc5LTMzZGQtNDQyZC05Mjk2LTE5OWQ0Yzg2YjhjYyIsImVtYWlsIjoiaW5mb0Bjb21wbGVyZWluZm9zeXN0ZW0uY29tIiwiaWF0IjoxNzI0MzE1MjAzLCJleHAiOjE3MjQ0MDE2MDN9.RiGsE6v8IzN4g7a7UVXnlTJeWiydBQYWVw02l5_HaPE"
      );
      break;
    case "post-settings":
      await postBotSettings(
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRJZCI6IjkxMWYxZTZhLTM5ZjItNDJhNS1iNDI5LTExYzg3NGJkMjcxYyIsImVtYWlsIjoiaW5mby1kZXZAY29tcGxlcmVpbmZvc3lzdGVtLmNvbSIsImlhdCI6MTcyNDgyMzAzNCwiZXhwIjoxNzI0OTA5NDM0fQ.gsgYTSCt0NXkIVu4ihQffKLF3yClLCat_JzEe7p_cSI",
        "7338aa95-8eac-4920-8e89-6bbbb7965697",
        "Say 'thank you' at last",
        0.5,
        "#f36a40",
        [
          "what is Complere Infosystem?",
          "what services do they provides?",
          "What is data analytics?",
          "How to contact them?",
        ]
      );
      break;
    case "get-settings":
      await getBotSettings(
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRJZCI6IjkxMWYxZTZhLTM5ZjItNDJhNS1iNDI5LTExYzg3NGJkMjcxYyIsImVtYWlsIjoiaW5mby1kZXZAY29tcGxlcmVpbmZvc3lzdGVtLmNvbSIsImlhdCI6MTcyNDkxMjczMCwiZXhwIjoxNzI0OTk5MTMwfQ.XgzmksJMLwaQUB1-TKtcsT1SM2zoKjBU4lHnzrV1eAA",
        "7338aa95-8eac-4920-8e89-6bbbb7965697"
      );
      break;
    default:
      console.log('Unknown command. Use "greet" or "farewell".');
      break;
  }

  process.exit(0);
}

main();
