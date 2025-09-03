const { CSVLoader } = require("@langchain/community/document_loaders/fs/csv");

async function loadCSV(filePath) {
  const loader = new CSVLoader(filePath);
  const data = await loader.load();
  return data;
}

module.exports = { loadCSV };
