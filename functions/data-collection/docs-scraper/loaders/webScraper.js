const axios = require("axios");
const cheerio = require("cheerio");
const {
  CheerioWebBaseLoader,
} = require("@langchain/community/document_loaders/web/cheerio");

const visitedUrls = new Set();

async function fetchPageHtml(pageUrl) {
  try {
    const response = await axios.get(pageUrl);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch ${pageUrl}: ${error.message}`);
    return null;
  }
}

function extractInternalLinks(baseUrl, html) {
  const $ = cheerio.load(html);
  const base = new URL(baseUrl);

  return $("a[href]")
    .map((i, el) => $(el).attr("href"))
    .get()
    .map((href) => new URL(href, base).toString())
    .filter(
      (link) =>
        link.startsWith(base.origin) &&
        !link.includes("#") &&
        !link.includes("download")
    );
}

async function scrapePage(pageUrl) {
  if (visitedUrls.has(pageUrl)) {
    console.log(`Skipping ${pageUrl} because it has already been visited`);
    return;
  }

  visitedUrls.add(pageUrl);
  const html = await fetchPageHtml(pageUrl);

  if (!html) return;

  console.log(`Scraping: ${pageUrl}`);

  const internalLinks = extractInternalLinks(pageUrl, html);

  for (const link of internalLinks) {
    if (!visitedUrls.has(link)) {
      await scrapePage(link); // Recursively scrape each internal link
    }
  }
}

// Example usage:
// (async () => {
//   const startUrl = 'https://complereinfosystem.com'; // Replace with the starting URL
//   await scrapePage(startUrl);

//   console.log('Visited URLs:', Array.from(visitedUrls));
// })();

const data = [
  "https://complereinfosystem.com",
  "https://complereinfosystem.com/",
  "https://complereinfosystem.com/migration/",
  "https://complereinfosystem.com/platform-migration/",
  "https://complereinfosystem.com/legacy-etl-to-modern-data-pipeline/",
  "https://complereinfosystem.com/datastage-to-talend/",
  "https://complereinfosystem.com/erp-migration/",
  "https://complereinfosystem.com/crm-migration/",
  "https://complereinfosystem.com/data-migration/",
  "https://complereinfosystem.com/salesforce-migration/",
  "https://complereinfosystem.com/hubspot-migration/",
  "https://complereinfosystem.com/cloud-migration/",
  "https://complereinfosystem.com/data-analytics/",
  "https://complereinfosystem.com/data-lake-consulting/",
  "https://complereinfosystem.com/data-warehouse-consulting/",
  "https://complereinfosystem.com/data-modelling/",
  "https://complereinfosystem.com/data-integration/",
  "https://complereinfosystem.com/data-governance/",
  "https://complereinfosystem.com/etl/",
  "https://complereinfosystem.com/data-strategy/",
  "https://complereinfosystem.com/data-compliance/",
  "https://complereinfosystem.com/data-deduplication/",
  "https://complereinfosystem.com/data-reconciliation/",
  "https://complereinfosystem.com/customized-data-processing-framework/",
  "https://complereinfosystem.com/data-streaming/",
  "https://complereinfosystem.com/api-implementation/",
  "https://complereinfosystem.com/data-ops/",
  "https://complereinfosystem.com/business-intelligence/",
  "https://complereinfosystem.com/digital-marketing-analysis/",
  "https://complereinfosystem.com/e-commerce-analytics/",
  "https://complereinfosystem.com/erp-reporting-capabilities/",
  "https://complereinfosystem.com/big-data/",
  "https://complereinfosystem.com/lakehouse-implementation/",
  "https://complereinfosystem.com/custom-application-development/",
  "https://complereinfosystem.com/ui-ux/",
  "https://complereinfosystem.com/frontend-development/",
  "https://complereinfosystem.com/backend-development/",
  "https://complereinfosystem.com/cloud/",
  "https://complereinfosystem.com/cloud-native-services/",
  "https://complereinfosystem.com/devops/",
  "https://complereinfosystem.com/aws-consulting/",
  "https://complereinfosystem.com/azure-consulting/",
  "https://complereinfosystem.com/databricks/",
  "https://complereinfosystem.com/salesforce/",
  "https://complereinfosystem.com/business-process-automation/",
  "https://complereinfosystem.com/bi-directional-sync-between-applications/",
  "https://complereinfosystem.com/rpa/",
  "https://complereinfosystem.com/software-qa-testing/",
  "https://complereinfosystem.com/manual-testing/",
  "https://complereinfosystem.com/automation-testing/",
  "https://complereinfosystem.com/team-extension/",
  "https://complereinfosystem.com/custom-software-development/",
  "https://complereinfosystem.com/engineering-solutions/",
  "https://complereinfosystem.com/technology-consulting/",
  "https://complereinfosystem.com/cloud-computing/",
  "https://complereinfosystem.com/architecture-design-implementation/",
  "https://complereinfosystem.com/process-automation/",
  "https://complereinfosystem.com/insights/",
  "https://complereinfosystem.com/case-studies",
  "https://complereinfosystem.com/career/",
  "https://complereinfosystem.com/blogs/",
  "https://complereinfosystem.com/partners/",
  "https://complereinfosystem.com/about/",
  "https://complereinfosystem.com/restructuring-developing-luxury-property-bookings-with-next-js/",
  "https://complereinfosystem.com/category/case-study/",
  "https://complereinfosystem.com/author/puneet-taneja/",
  "https://complereinfosystem.com/processing-change-data-capture-databricks/",
  "https://complereinfosystem.com/category/blog/data/",
  "https://complereinfosystem.com/how-to-join-two-incremental-tables-in-databricks/",
  "https://complereinfosystem.com/top-data-engineering-tools-technologies-2024/",
  "https://complereinfosystem.com/data-pipelines-ultimate-guide-everything/",
  "https://complereinfosystem.com/cloud-migration-challenges-and-strategies/",
  "https://complereinfosystem.com/category/blog/cloud/",
  "https://complereinfosystem.com/benefits-aws-cloud-platform-scalability-agility/",
  "https://complereinfosystem.com/amazon-web-services-data-infrastructure-transformation/",
  "https://complereinfosystem.com/category/blog/",
  "https://complereinfosystem.com/update-aggregates-key-value-stores/",
  "https://complereinfosystem.com/augmenting-flexibility-data-management/",
  "https://complereinfosystem.com/category/blog/analytics/",
  "https://complereinfosystem.com/best-data-analytics-tools-technologies-2024/",
  "https://complereinfosystem.com/top-8-data-analytics-tools-technologies-2024/",
  "https://complereinfosystem.com/leading-data-analytics-tools-technologies-2024/",
  "https://complereinfosystem.com/top-data-analytics-tools-technologies-2024/",
  "https://complereinfosystem.com/mastering-power-bi-desktop-2024/",
  "https://complereinfosystem.com/optimizing-power-bi-reports-for-performance/",
  "https://complereinfosystem.com/data-modeling-and-relationships-in-power-bi/",
  "https://complereinfosystem.com/creating-formatting-visualizations-power-bi/",
  "https://complereinfosystem.com/case-study-of-power-bi/",
  "https://complereinfosystem.com/yum-brands-aws-redshift-migration/",
  "https://complereinfosystem.com/new-york-businesses-moving-cloud-platforms/",
  "https://complereinfosystem.com/platform-migration-challenges-for-new-york/",
  "https://complereinfosystem.com/challenges-and-solutions-in-data-migration/",
  "https://complereinfosystem.com/mastering-the-art-of-data-migration/",
  "https://complereinfosystem.com/how-to-integrate-salesforce-with-other-business-tools/",
  "https://complereinfosystem.com/how-to-protect-sensitive-customer-data/",
  "https://complereinfosystem.com/top-8-database-security-solutions-for-e-commerce-businesses/",
  "https://complereinfosystem.com/how-to-aggregate-data-for-powerful-insights-for-a-business/",
  "https://complereinfosystem.com/step-by-step-guide-to-transform-data-in-azure-data-factory-adf/",
  "https://complereinfosystem.com/how-to-validate-the-data-after-aggregation/",
  "https://complereinfosystem.com/how-to-ensure-data-security-compliance/",
];

async function webScraper() {
  try {
    // await scrapePage(startUrl);

    // const visitedUrlsArray = Array.from(visitedUrls);

    let concatedData = [];
    for (const [i, link] of data.entries()) {
      const loader = new CheerioWebBaseLoader(link, {
        selector: "p,h1,h2,h3,h4,h5,h6,li,table,td,th",
      });

      const data = await loader.load();

      concatedData = concatedData.concat(data);
      console.log(`${i} : ${data.length}`);
    }

    console.log(concatedData);
    return concatedData;
  } catch (error) {
    console.log(error);
  }
}

module.exports = { webScraper };

// const cheerio = require("cheerio");
// const {
//   CheerioWebBaseLoader,
// } = require("@langchain/community/document_loaders/web/cheerio");
// const axios = require("axios");

// const visitedUrls = new Set();

// async function fetchPageHtml(pageUrl) {
//   try {
//     const response = await axios.get(pageUrl);
//     return response.data;
//   } catch (error) {
//     console.error(`Failed to fetch ${pageUrl}: ${error.message}`);
//     return null;
//   }
// }

// function extractInternalLinks(baseUrl, html) {
//   const $ = cheerio.load(html);
//   const base = new URL(baseUrl);

//   return $("a[href]")
//     .map((i, el) => $(el).attr("href"))
//     .get()
//     .map((href) => new URL(href, base).toString())
//     .filter(
//       (link) =>
//         link.startsWith(base.origin) &&
//         !link.includes("#") &&
//         !link.includes("download")
//     );
// }

// async function scrapePage(pageUrl) {
//   if (visitedUrls.has(pageUrl)) {
//     console.log(`Already visited: ${pageUrl}`);
//     return;
//   }

//   visitedUrls.add(pageUrl);
//   const html = await fetchPageHtml(pageUrl);

//   if (!html) return;
//   console.log(`Scraping: ${pageUrl}`);
//   const internalLinks = extractInternalLinks(pageUrl, html);

//   for (const link of internalLinks) {
//     if (!visitedUrls.has(link)) {
//       await scrapePage(link); // Recursively scrape each internal link
//     }
//   }
// }

// const data = [
//   "https://complereinfosystem.com",
//   "https://complereinfosystem.com/",
//   "https://complereinfosystem.com/migration/",
//   "https://complereinfosystem.com/platform-migration/",
//   "https://complereinfosystem.com/legacy-etl-to-modern-data-pipeline/",
//   "https://complereinfosystem.com/datastage-to-talend/",
//   "https://complereinfosystem.com/erp-migration/",
//   "https://complereinfosystem.com/crm-migration/",
//   "https://complereinfosystem.com/data-migration/",
//   "https://complereinfosystem.com/salesforce-migration/",
//   "https://complereinfosystem.com/hubspot-migration/",
//   "https://complereinfosystem.com/cloud-migration/",
//   "https://complereinfosystem.com/data-analytics/",
//   "https://complereinfosystem.com/data-lake-consulting/",
//   "https://complereinfosystem.com/data-warehouse-consulting/",
//   "https://complereinfosystem.com/data-modelling/",
//   "https://complereinfosystem.com/data-integration/",
//   "https://complereinfosystem.com/data-governance/",
//   "https://complereinfosystem.com/etl/",
//   "https://complereinfosystem.com/data-strategy/",
//   "https://complereinfosystem.com/data-compliance/",
//   "https://complereinfosystem.com/data-deduplication/",
//   "https://complereinfosystem.com/data-reconciliation/",
//   "https://complereinfosystem.com/customized-data-processing-framework/",
//   "https://complereinfosystem.com/data-streaming/",
//   "https://complereinfosystem.com/api-implementation/",
//   "https://complereinfosystem.com/data-ops/",
//   "https://complereinfosystem.com/business-intelligence/",
//   "https://complereinfosystem.com/digital-marketing-analysis/",
//   "https://complereinfosystem.com/e-commerce-analytics/",
//   "https://complereinfosystem.com/erp-reporting-capabilities/",
//   "https://complereinfosystem.com/big-data/",
//   "https://complereinfosystem.com/lakehouse-implementation/",
//   "https://complereinfosystem.com/custom-application-development/",
//   "https://complereinfosystem.com/ui-ux/",
//   "https://complereinfosystem.com/frontend-development/",
//   "https://complereinfosystem.com/backend-development/",
//   "https://complereinfosystem.com/cloud/",
//   "https://complereinfosystem.com/cloud-native-services/",
//   "https://complereinfosystem.com/devops/",
//   "https://complereinfosystem.com/aws-consulting/",
//   "https://complereinfosystem.com/azure-consulting/",
//   "https://complereinfosystem.com/databricks/",
//   "https://complereinfosystem.com/salesforce/",
//   "https://complereinfosystem.com/business-process-automation/",
//   "https://complereinfosystem.com/bi-directional-sync-between-applications/",
//   "https://complereinfosystem.com/rpa/",
//   "https://complereinfosystem.com/software-qa-testing/",
//   "https://complereinfosystem.com/manual-testing/",
//   "https://complereinfosystem.com/automation-testing/",
//   "https://complereinfosystem.com/team-extension/",
//   "https://complereinfosystem.com/custom-software-development/",
//   "https://complereinfosystem.com/engineering-solutions/",
//   "https://complereinfosystem.com/technology-consulting/",
//   "https://complereinfosystem.com/cloud-computing/",
//   "https://complereinfosystem.com/architecture-design-implementation/",
//   "https://complereinfosystem.com/process-automation/",
//   "https://complereinfosystem.com/insights/",
//   "https://complereinfosystem.com/case-studies",
//   "https://complereinfosystem.com/career/",
//   "https://complereinfosystem.com/blogs/",
//   "https://complereinfosystem.com/partners/",
//   "https://complereinfosystem.com/about/",
//   "https://complereinfosystem.com/restructuring-developing-luxury-property-bookings-with-next-js/",
//   "https://complereinfosystem.com/category/case-study/",
//   "https://complereinfosystem.com/author/puneet-taneja/",
//   "https://complereinfosystem.com/processing-change-data-capture-databricks/",
//   "https://complereinfosystem.com/category/blog/data/",
//   "https://complereinfosystem.com/how-to-join-two-incremental-tables-in-databricks/",
//   "https://complereinfosystem.com/top-data-engineering-tools-technologies-2024/",
//   "https://complereinfosystem.com/data-pipelines-ultimate-guide-everything/",
//   "https://complereinfosystem.com/cloud-migration-challenges-and-strategies/",
//   "https://complereinfosystem.com/category/blog/cloud/",
//   "https://complereinfosystem.com/benefits-aws-cloud-platform-scalability-agility/",
//   "https://complereinfosystem.com/amazon-web-services-data-infrastructure-transformation/",
//   "https://complereinfosystem.com/category/blog/",
//   "https://complereinfosystem.com/update-aggregates-key-value-stores/",
//   "https://complereinfosystem.com/augmenting-flexibility-data-management/",
//   "https://complereinfosystem.com/category/blog/analytics/",
//   "https://complereinfosystem.com/best-data-analytics-tools-technologies-2024/",
//   "https://complereinfosystem.com/top-8-data-analytics-tools-technologies-2024/",
//   "https://complereinfosystem.com/leading-data-analytics-tools-technologies-2024/",
//   "https://complereinfosystem.com/top-data-analytics-tools-technologies-2024/",
//   "https://complereinfosystem.com/mastering-power-bi-desktop-2024/",
//   "https://complereinfosystem.com/optimizing-power-bi-reports-for-performance/",
//   "https://complereinfosystem.com/data-modeling-and-relationships-in-power-bi/",
//   "https://complereinfosystem.com/creating-formatting-visualizations-power-bi/",
//   "https://complereinfosystem.com/case-study-of-power-bi/",
//   "https://complereinfosystem.com/yum-brands-aws-redshift-migration/",
//   "https://complereinfosystem.com/new-york-businesses-moving-cloud-platforms/",
//   "https://complereinfosystem.com/platform-migration-challenges-for-new-york/",
//   "https://complereinfosystem.com/challenges-and-solutions-in-data-migration/",
//   "https://complereinfosystem.com/mastering-the-art-of-data-migration/",
//   "https://complereinfosystem.com/how-to-integrate-salesforce-with-other-business-tools/",
//   "https://complereinfosystem.com/how-to-protect-sensitive-customer-data/",
//   "https://complereinfosystem.com/top-8-database-security-solutions-for-e-commerce-businesses/",
//   "https://complereinfosystem.com/how-to-aggregate-data-for-powerful-insights-for-a-business/",
//   "https://complereinfosystem.com/step-by-step-guide-to-transform-data-in-azure-data-factory-adf/",
//   "https://complereinfosystem.com/how-to-validate-the-data-after-aggregation/",
//   "https://complereinfosystem.com/how-to-ensure-data-security-compliance/",
// ];

// class Document {
//     constructor(pageContent, metadata) {
//       this.pageContent = pageContent;
//       this.metadata = metadata;
//     }
//   }

//   // Function to clean the page content
//   function cleanPageContent(documents) {
//     return documents.map((doc) => {
//       // Replace all whitespace characters (including spaces, tabs, and newlines) with a single space
//       const cleanedContent = doc.pageContent
//         .replace(/\s+/g, " ") // Replace multiple whitespaces with a single space
//         .trim(); // Trim leading and trailing spaces

//       // Return a new Document instance with cleaned pageContent
//       return new Document(cleanedContent, doc.metadata);
//     });
//   }

//   // Recursive function to scrape pages
//   async function scrapePage(link) {
//     // Check if the URL has already been visited
//     if (visitedUrls.has(link)) {
//       console.log(`Already visited: ${link}`);
//       return;
//     }

//     visitedUrls.add(link);

//     // Initialize the loader
//     const loader = new CheerioWebBaseLoader(link);

//     // Load the documents from the given URL
//     const docs = await loader.load();

//     // Clean the documents' content
//     const cleanedDocs = cleanPageContent(docs);

//     // Print cleaned documents
//     console.log(cleanedDocs);

//     console.log(`Scraped: ${link}`);
//   }

//   // Main function to scrape all provided URLs
//   async function webScraper() {
//     for (const link of data) {
//       await scrapePage(link);
//     }

//     console.log("Scraping complete. Visited URLs:", Array.from(visitedUrls));
//   }

//   // Run the web scraper
//   webScraper();

// class Document {
//     constructor(pageContent, metadata) {
//       this.pageContent = pageContent;
//       this.metadata = metadata;
//     }
//   }

// function cleanPageContent(documents) {
// return documents.map(doc => {
//     // Replace all whitespace characters (including spaces, tabs, and newlines) with nothing
//     const cleanedContent = doc.pageContent
//       .replace(/\s+/g, ' ')  // Remove all whitespace
//       .trim();              // Ensure no leading/trailing spaces (just in case)

//     // Return a new Document instance with cleaned pageContent
//     return new Document(cleanedContent, doc.metadata);
//   });
//   }
// // Example usage:
// async function webScraper() {
//   //   const startUrl = "https://complereinfosystem.com"; // Replace with the starting URL
//   //   await scrapePage(startUrl);

//   for (const [i,link] of data.entries()) {
//     const loader = new CheerioWebBaseLoader(link);

//     const docs = await loader.load();
//     console.log(cleanPageContent(docs))

//     console.log(i,"SCraped!");
//   }

// //   console.log("Visited URLs:", Array.from(visitedUrls));
// }

// webScraper();
