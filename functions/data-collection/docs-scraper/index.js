const { docsScraper } = require("./service");

module.exports.handler = async (event) => {
  try {
    const bot_document_id = event.queryStringParameters.bot_document_id;
    const url = event.queryStringParameters.url;

    const fileBlob = event.body;
    const mimeType = event.fileMimeType; // Get the MIME type from the event
    if (fileBlob && mimeType) {
      // Handle different file types
      switch (mimeType) {
        case "application/pdf":
        case "text/csv":
        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          // case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':

          // Call the service with the file data
          const parsedData = await docsScraper(
            fileBlob,
            mimeType,
            url,
            bot_document_id
          );
          return {
            statusCode: 200,
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: parsedData,
              bot_document_id,
              url,
            }),
          };
        default:
          return {
            statusCode: 400,
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: "Unsupported file type",
            }),
          };
      }
    } else {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "No file uploaded or MIME type missing",
        }),
      };
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Internal Server Error",
      }),
    };
  }
};

// const { docsScraper } = require("./service");

// module.exports.handler = async (event) => {
//   try {
//     const req = {
//       headers: event.headers,
//       file: {
//         buffer: Buffer.from(event.body, "base64"),
//         mimetype: "docx",
//       },
//     };

//     // Extract bot_document_id and url from query parameters
//     const bot_document_id = event.queryStringParameters.bot_document_id;
//     const url = event.queryStringParameters.url;

//     if (req.file) {
//       const fileBuffer = req.file.buffer;
//       const mimeType = req.file.mimetype;

//       // Parse the file using the service
//       const parsedData = await docsScraper(
//         fileBuffer,
//         mimeType,
//         url,
//         bot_document_id
//       );

//       return {
//         statusCode: 200,
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           message: parsedData,
//           bot_document_id,
//           url,
//         }),
//       };
//     } else {
//       return {
//         statusCode: 400,
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           message: "No file uploaded",
//         }),
//       };
//     }
//   } catch (error) {
//     console.error(error);
//     return {
//       statusCode: 500,
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         message: "Internal Server Error",
//       }),
//     };
//   }
// };

// module.exports.handler = async (event) => {
//   try {
//     const bot_document_id = event.queryStringParameters.bot_document_id;
//     const url = event.queryStringParameters.url;
//     const scrapedData = await webScraper(bot_document_id, url);
//     return {
//       statusCode: 200,
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         message: scrapedData,
//       }),
//     };
//   } catch (error) {
//     console.error(error);
//     return {
//       statusCode: 500,
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         message: "Internal Server Error",
//       }),
//     };
//   }
// };
