const { AzureOpenAIEmbeddings } = require("@langchain/openai");

function getEmbeddings() {
  return new AzureOpenAIEmbeddings({
    azureOpenAIApiKey: process.env.AZURE_API_KEY,
    azureOpenAIApiInstanceName: process.env.AZURE_INSTANCE_NAME,
    azureOpenAIApiEmbeddingsDeploymentName: process.env.AZURE_API_EMBEDDINGS,
    azureOpenAIApiVersion: process.env.AZURE_API_VERSION,
    dimensions: process.env.VECTOR_DIMENSION,
  });
}

module.exports = { getEmbeddings };
