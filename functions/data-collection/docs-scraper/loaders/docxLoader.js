const { DocxLoader } = require("@langchain/community/document_loaders/fs/docx");

async function loadDOCX(filePath) {
    const loader = new DocxLoader(filePath);
    const data = await loader.load();
    return data;
}

module.exports = { loadDOCX }