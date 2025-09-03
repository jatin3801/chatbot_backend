const { openaiEmbeddings } = require("./openai");

const generateEmbeddings = async (text) => {
  const response = await openaiEmbeddings.embeddings.create({
    input: text,
    model: "text-embedding-ada-002",
    dimensions: 1536,
  });
  return response.data[0]?.embedding;
};

module.exports = { generateEmbeddings };
