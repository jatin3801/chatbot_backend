// const { webScraper } = require("./loaders/webScraper.js");
// const { splitDocuments } = require("./splitters/textSplitters.js");
// const {
//   storeEmbeddingsInPGVectorStore,
// } = require("./vectorStores/pgVectorStore.js");
// const dotenv = require("dotenv");
// const { TextLoader } = require("langchain/document_loaders/fs/text");

// dotenv.config();

// async function loadWebData(_, url) {
//   try {
//     const documents = await webScraper(url);
//     const splittedDocuments = await splitDocuments(documents);
//     const documents_length = splittedDocuments.length;

//     for (const [i, doc] of splittedDocuments.entries()) {
//       const arrayDoc = [doc];
//       await storeEmbeddingsInPGVectorStore(arrayDoc);
//       console.log(
//         ` ${i + 1} of ${documents_length} Embeddings stored for ${
//           doc.metadata.source
//         }`
//       );
//     }
//     console.log("Document Stored  successfully");
//   } catch (error) {
//     console.log(error);
//   }
// }

// module.exports = { loadWebData };

const { TextLoader } = require("langchain/document_loaders/fs/text");
const {
  CheerioWebBaseLoader,
} = require("@langchain/community/document_loaders/web/cheerio");
const { Blob } = require("buffer");
const { scrapeWebsite } = require("./loaders/webScraper.js");
const { splitDocuments } = require("./splitters/textSplitters.js");
const {
  storeEmbeddingsInPGVectorStore,
} = require("./vectorStores/pgVectorStore.js");
const dotenv = require("dotenv");
// const { data } = require("./scraped_data.js");
dotenv.config();
const {
  RecursiveUrlLoader,
} = require("@langchain/community/document_loaders/web/recursive_url");
const { compile } = require("html-to-text");
const fs = require("fs");
const compiledConvert = compile({
  wordwrap: 130,
  baseElements: {
    selectors: [
      "p",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "li",
      "table",
      "td",
      "th",
    ],
  },
}); // returns (text: string) => string;

/**
 * Web scrapes the given URL and embeds the scraped data into the bot document.
 *
 * @param {string} bot_document_id - The ID of the bot document to embed the scraped data into.
 * @param {string} url - The URL to scrape.
 * @return {Promise<void>} - A promise that resolves when the scraped data has been embedded into the bot document.
 */
const loadWebData = async (bot_document_id, url) => {
  try {
    // const extractedTextFromWebsite = await scrapeWebsite(url);

    // const textBlob = new Blob([data.text], {
    //   type: "text/plain",
    // });

    // const textLoader = new TextLoader(textBlob);
    // const textChunks = await textLoader.load();

    // const loader = new CheerioWebBaseLoader(url, {
    //   selector: "p,h1,h2,h3,h4,h5,h6,li,table,td,th",
    // });

    const loader = new RecursiveUrlLoader(url, {
      extractor: compiledConvert,
      maxDepth: 99,
      excludeDirs: ["/docs/api/", "/#", "/download"],
    });
    const documents = await loader.load();
    const chunkedContext = await splitDocuments(documents);

    // fs.writeFileSync("./scraped_data_2.json", JSON.stringify(chunkedContext));

    console.log(chunkedContext.length);
    const chunk_context_length = chunkedContext.length;

    for (const [i, doc] of chunkedContext.entries()) {
      doc.metadata["bot_document_id"] = bot_document_id;
      const arrayDoc = [doc];
      await storeEmbeddingsInPGVectorStore(arrayDoc);
      console.log(
        ` ${i + 1} of ${chunk_context_length} Embeddings stored for ${
          doc.metadata.source
        }`
      );
    }
    console.log("Document Stored  successfully");
  } catch (error) {
    console.error(error);
  }
};

module.exports = { loadWebData };

// // const scrapedUrls = await scrapeAllUrls(url);

// // const uniqueChunks = new Set();

// // const scrapePromises = scrapedUrls.map(async (uri, idx) => {
// //   const scrapedData = await scrape(uri);
// //   console.log(idx, ":URL SCRAPED:", uri);
// //   const chunkedContext = await splitScrapedData(scrapedData);
// //   chunkedContext.forEach((chunk) => uniqueChunks.add(chunk));
// // });

// // await Promise.all(scrapePromises);

// // const arr = Array.from(uniqueChunks);

// // console.log(uniqueChunks.size);
// // ------------------------------------------------------------------------

// // const visitedUrls = new Set();
// // /**
// //  * Scrapes all URLs starting from the given base URL.
// //  *
// //  * @param {string} baseUrl - The base URL to start crawling from.
// //  * @return {Promise<string[]>} A promise that resolves to an array of visited URLs.
// //  */
// // async function scrapeAllUrls(baseUrl) {
// //   const urlQueue = [baseUrl];
// //   while (urlQueue.length > 0) {
// //     const currentUrl = urlQueue.shift();
// //     if (visitedUrls.has(currentUrl)) {
// //       continue;
// //     }

// //     try {
// //       const response = await axios.get(currentUrl);
// //       if (
// //         response.headers["content-type"] &&
// //         !response.headers["content-type"].includes("text/html")
// //       ) {
// //         continue;
// //       }
// //       if (response.status !== 200) {
// //         continue;
// //       }

// //       visitedUrls.add(currentUrl);
// //       console.log(`Visited: ${currentUrl}`);
// //       const $ = cheerio.load(response.data);
// //       $("a").each((index, element) => {
// //         const href = $(element).attr("href");
// //         if (href) {
// //           const absoluteUrl = url.resolve(baseUrl, href);
// //           if (
// //             absoluteUrl.startsWith(baseUrl) &&
// //             !visitedUrls.has(absoluteUrl) &&
// //             !absoluteUrl.includes("#")
// //           ) {
// //             urlQueue.push(absoluteUrl);
// //           }
// //         }
// //       });
// //     } catch (error) {
// //       console.error(`Failed to crawl ${currentUrl}: ${error.message}`);
// //     }
// //   }
// //   return Array.from(visitedUrls);
// // }

// // /**
// //  * Scrapes the given URL and returns the scraped data, ensuring no duplicate content.
// //  *
// //  * @param {string} url - The URL to scrape.
// //  * @return {Promise<string>} The scraped data as a string.
// //  */
// // async function scrape(url) {
// //   try {
// //     const { data } = await axios.get(url);
// //     const $ = cheerio.load(data);
// //     const scrapedData = $("p,h1,h2,h3,h4,h5,h6")
// //       .map((i, el) => $(el).text().trim())
// //       .get()
// //       .join(" ");
// //     return scrapedData.replace(/\s+/g, " ").trim();
// //   } catch (error) {
// //     console.error(`Error scraping ${url}:`, error);
// //     return null;
// //   }
// // }

// // /**
// //  * Embeds the scraped data into the bot document.
// //  *
// //  * @param {string} bot_document_id - The ID of the bot document to embed the scraped data into.
// //  * @param {Array<string>} chunkedContext - The array of chunks of scraped data.
// //  * @return {Promise<void>} - A promise that resolves when the scraped data has been embedded into the bot document.
// //  */
// // async function embedScrapedData(bot_document_id, chunkedContext) {
// //   for (const [i, chunk] of chunkedContext.entries()) {
// //     const embedding = await generateEmbeddings(chunk);
// //     await insertEmbeddings(bot_document_id, chunk, embedding);
// //     console.log(
// //       `Embedding for chunk ${i + 1} generated successfully`,
// //       embedding
// //     );
// //   }
// // }

// // /**
// //  * Inserts an embedding into the `bot_document_chunks` table.
// //  *
// //  * @param {string} bot_document_id - The ID of the bot document to associate the embedding with.
// //  * @param {string} chunk_context - The context of the embedding.
// //  * @param {Array<number>} chunk_embeddings - The embedding values.
// //  * @return {Promise<number>} - A promise that resolves with the ID of the inserted chunk.
// //  */
// // async function insertEmbeddings(
// //   bot_document_id,
// //   chunk_context,
// //   chunk_embeddings
// // ) {
// //   const client = await dbPool.connect();
// //   try {
// //     const result = await client.query(
// //       `INSERT INTO bot_document_chunks (context, embedding, bot_document_id) VALUES ($1, $2, $3) RETURNING bot_document_chunk_id;`,
// //       [chunk_context, pgVector.toSql(chunk_embeddings), bot_document_id]
// //     );
// //     return result.rows[0].bot_document_chunk_id;
// //   } catch (error) {
// //     console.error(error);
// //   } finally {
// //     client.release();
// //   }
// // }

// // /**
// //  * Splits the scraped data into chunks using the splitText function.
// //  *
// //  * @param {string} scrapedData - The data to be split.
// //  * @return {Promise<Array<string>>} A promise that resolves to an array of chunks.
// //  */
