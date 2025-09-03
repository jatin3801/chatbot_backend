const { openaiEmbeddings } = require("./openai");

const generateEmbeddings = async (text) => {
  const response = await openaiEmbeddings.embeddings.create({
    input: text,
    model: "text-embedding-3-large",
    dimensions: 1536,
  });
  return response.data[0]?.embedding;
};

module.exports = { generateEmbeddings };
