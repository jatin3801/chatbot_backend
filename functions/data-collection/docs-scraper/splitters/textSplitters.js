const { RecursiveCharacterTextSplitter } =  require("langchain/text_splitter");

async function splitDocuments(docs) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 2000,
    chunkOverlap: 200,
  });
  const splits = await splitter.splitDocuments(docs);
  return splits;
}

module.exports = { splitDocuments };
