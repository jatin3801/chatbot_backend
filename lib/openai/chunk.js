const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');

const splitText = async text => {
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 800,
    chunkOverlap: 50,
    separators: ['\n\n', '.'],
  });
  return await textSplitter.splitText(text);
};

module.exports = { splitText };
