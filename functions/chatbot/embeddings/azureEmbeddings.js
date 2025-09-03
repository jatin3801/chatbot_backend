const { AzureOpenAIEmbeddings } = require("@langchain/openai");

const embeddings = new AzureOpenAIEmbeddings({
  azureOpenAIApiKey: process.env.AZURE_API_KEY,
  azureOpenAIApiInstanceName: process.env.AZURE_INSTANCE_NAME,
  azureOpenAIApiEmbeddingsDeploymentName: process.env.AZURE_API_EMBEDDINGS,
  azureOpenAIApiVersion: process.env.AZURE_API_VERSION,
  dimensions: 3072,
});

module.exports = { embeddings };
