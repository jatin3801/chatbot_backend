const { PGVectorStore } = require("@langchain/community/vectorstores/pgvector");
const { getEmbeddings } = require("../embeddings/azureEmbeddings.js");
const { getDBConfig } = require("../config/databaseConfig.js");

async function storeEmbeddingsInPGVectorStore(docs) {
  try {
    const embeddings = getEmbeddings();
    const config = getDBConfig();
    const vectorStore = new PGVectorStore(embeddings, {
      tableName: "bot_document_chunks_test",
      columns: {
        idColumnName: "id",
        contentColumnName: "content",
        vectorColumnName: "vector",
        metadataColumnName: "metadata",
      },
      postgresConnectionOptions: config,
      distanceStrategy: "cosine",
    });

    await vectorStore.addDocuments(docs);
  } catch (error) {
    console.log(error);
  }
}

module.exports = { storeEmbeddingsInPGVectorStore };
