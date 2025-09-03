const dotenv = require("dotenv");
const { loadCSV } = require("./loaders/csvLoader.js");
const { loadPDF } = require("./loaders/pdfLoader.js");
const { loadDOCX } = require("./loaders/docxLoader.js");
const { webScraper } = require("./loaders/webScraper.js");
const { splitDocuments } = require("./splitters/textSplitters.js");
const {
  storeEmbeddingsInPGVectorStore,
} = require("./vectorStores/pgVectorStore.js");
const { Blob } = require("buffer");

dotenv.config();

async function loadDocument({ fileType, file }) {
  let docs = [];

  switch (fileType) {
    case "text/csv":
      docs = await loadCSV(file);
      break;
    case "application/pdf":
      docs = await loadPDF(file);
      break;
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      docs = await loadDOCX(file);
      break;
    default:
      throw new Error(`Unsupported file type: ${fileType}`);
  }

  return docs;
}

async function docsScraper(file, fileType, url, bot_document_id) {
  try {
    // Load document
    const docs = await loadDocument({
      fileType,
      file,
      url,
    });

    //split documents into chunks
    const splitDocs = await splitDocuments(docs);

    const chunk_context_length = splitDocs.length;

    for (const [i, doc] of splitDocs.entries()) {
      doc.metadata["bot_document_id"] = bot_document_id;
      const arrayDoc = [doc];
      await storeEmbeddingsInPGVectorStore(arrayDoc);
      console.log(
        ` ${i + 1} of ${chunk_context_length} Embeddings stored for ${
          doc.metadata.source
        }`
      );
    }

    console.log("Document processed and stored successfully.");
  } catch (error) {
    console.error("Error processing document:", error);
  }
}

module.exports = { docsScraper };

// const pdfParser = require("pdf-parse");
// const mammoth = require("mammoth");
// const csvParser = require("csv-parser");
// const { Readable } = require("stream");
// const { generateEmbeddings } = require("./lib/openai/embedding");
// const { splitText } = require("./lib/openai/chunk");
// const { dbPool } = require("./lib/pg");
// const pgVector = require("pgvector/pg");

// async function extractPDFdocs(bufferData) {
//   const data = await pdfParser(bufferData);
//   return data.text.replace(/\s+/g, " ").toString();
// }

// async function extractWordDocs(bufferData) {
//   const data = await mammoth.extractRawText({ buffer: bufferData });
//   return data.value.replace(/\s+/g, " ").toString();
// }

// function extractCSVData(buffer) {
//   return new Promise((resolve, reject) => {
//     const results = [];

//     // Create a readable stream from the buffer
//     const bufferStream = new Readable();
//     bufferStream.push(buffer);
//     bufferStream.push(null); // Indicates the end of the stream

//     bufferStream
//       .pipe(csvParser())
//       .on("data", (data) => results.push(data))
//       .on("end", () => {
//         resolve(results.map((obj) => Object.values(obj).join("")).join(" "));
//       })
//       .on("error", (error) => {
//         reject(error);
//       });
//   });
// }

// async function extractFileData(bufferData, fileType) {
//   switch (fileType) {
//     case "application/docx":
//       return extractWordDocs(bufferData);
//     case "application/pdf":
//       return extractPDFdocs(bufferData);
//     case "application/csv":
//       return extractCSVData(bufferData);
//     default:
//       throw new Error("Unsupported file type");
//   }
// }

// /**
//  * Inserts an embedding into the `bot_document_chunks` table.
//  *
//  * @param {string} bot_document_id - The ID of the bot document to associate the embedding with.
//  * @param {string} chunk_context - The context of the embedding.
//  * @param {Array<number>} chunk_embeddings - The embedding values.
//  * @return {Promise<number>} - A promise that resolves with the ID of the inserted chunk.
//  */
// async function insertEmbeddings(
//   bot_document_id,
//   chunk_context,
//   chunk_embeddings
// ) {
//   const client = await dbPool.connect();
//   try {
//     const result = await client.query(
//       `INSERT INTO bot_document_chunks (context, embedding, bot_document_id) VALUES ($1, $2, $3) RETURNING bot_document_chunk_id;`,
//       [chunk_context, pgVector.toSql(chunk_embeddings), bot_document_id]
//     );
//     return result.rows[0].bot_document_chunk_id;
//   } catch (error) {
//     console.error(error);
//   } finally {
//     client.release();
//   }
// }

// /**
//  * Embeds the scraped data into the bot document by generating embeddings for each chunk of the data and inserting them into the database.
//  *
//  * @param {string} bot_document_id - The ID of the bot document to embed the scraped data into.
//  * @param {Array<string>} chunkedContext - The array of chunks of scraped data.
//  * @return {Promise<void>} - A promise that resolves when the scraped data has been embedded into the bot document.
//  */
// async function embedScrapedData(bot_document_id, chunkedContext) {
//   for (const [i, chunk] of chunkedContext.entries()) {
//     const embedding = await generateEmbeddings(chunk);
//     await insertEmbeddings(bot_document_id, chunk, embedding);
//     console.log(
//       `Embedding for chunk ${i + 1} generated successfully`,
//       embedding
//     );
//   }
// }

// /**
//  * Splits the scraped data into chunks.
//  *
//  * @param {string} scrapedData - The data to be split.
//  * @return {Promise<Array<string>>} A promise that resolves to an array of chunks.
//  */
// async function splitScrapedData(scrapedData) {
//   console.log(scrapedData);
//   const chunkedContext = await splitText(scrapedData);
//   return chunkedContext;
// }

// async function scrapeDocs(buffer, fileType, url, bot_document_id) {
//   try {
//     const textDataFromDocs = await extractFileData(buffer, fileType);
//     const chunkedContext = await splitScrapedData(textDataFromDocs);

//     console.log(chunkedContext);
//     console.log(chunkedContext.length);
//     console.log(bot_document_id);

//     await embedScrapedData(bot_document_id, chunkedContext);
//   } catch (error) {
//     console.log(error);
//   }
// }

// module.exports = { scrapeDocs };
