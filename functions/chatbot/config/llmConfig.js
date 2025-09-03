const { AzureChatOpenAI } = require("@langchain/openai");

function generateLLMConfig(temperature) {
  return new AzureChatOpenAI({
    azureOpenAIApiKey: process.env.AZURE_API_KEY,
    azureOpenAIApiVersion: process.env.AZURE_API_VERSION,
    azureOpenAIApiDeploymentName: process.env.AZURE_API_DEPLOYMENT,
    azureOpenAIApiInstanceName: process.env.AZURE_INSTANCE_NAME,
    temperature: +temperature || 0.7, // Fallback to a default temperature
  });
}

module.exports = { generateLLMConfig };
