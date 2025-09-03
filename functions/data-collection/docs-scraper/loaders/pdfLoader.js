const { PDFLoader } = require("@langchain/community/document_loaders/fs/pdf");

async function loadPDF(filePath) {
  const loader = new PDFLoader(filePath);
  const data = await loader.load();
  return data;
}

module.exports = { loadPDF }