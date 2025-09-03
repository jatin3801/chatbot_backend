const { PGVectorStore } = require("@langchain/community/vectorstores/pgvector");
const { getDBConfig } = require("../config/databaseConfig");
const { embeddings } = require("../embeddings/azureEmbeddings");

const vectorStore = new PGVectorStore(embeddings, {
  tableName: "bot_document_chunks",
  columns: {
    idColumnName: "id",
    contentColumnName: "content",
    vectorColumnName: "vector",
    metadataColumnName: "metadata",
  },
  postgresConnectionOptions: getDBConfig(),
  distanceStrategy: "cosine",
});

module.exports = { vectorStore };
