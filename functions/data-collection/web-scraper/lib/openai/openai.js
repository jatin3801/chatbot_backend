const { AzureOpenAI } = require("openai");
const dotenv = require("dotenv");
dotenv.config();

const apiKey = process.env.AZURE_API_KEY;
const endpoint = process.env.AZURE_API_ENDPOINT;
const apiVersion = process.env.AZURE_API_VERSION;
const deployment = process.env.AZURE_API_DEPLOYMENT;
const embeddings = process.env.AZURE_API_EMBEDDINGS;

const openaiChatCompletions = new AzureOpenAI({
  endpoint: endpoint,
  apiKey: apiKey,
  apiVersion: apiVersion,
  deployment: deployment,
});

const openaiEmbeddings = new AzureOpenAI({
  endpoint: endpoint,
  apiKey: apiKey,
  apiVersion: apiVersion,
  deployment: embeddings,
});

module.exports = { openaiChatCompletions, openaiEmbeddings };
