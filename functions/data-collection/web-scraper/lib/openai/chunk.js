const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');

const splitText = async text => {
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 50,
  });
  return await textSplitter.splitText(text);
};

module.exports = { splitText };
