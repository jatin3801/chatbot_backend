const {
  contextualizeQSystemPrompt,
  qaSystemPrompt,
} = require("../prompts/prompts");
const { vectorStore } = require("../vectorStores/pgVectorStore");
const { StringOutputParser } = require("@langchain/core/output_parsers");
const {
  ChatPromptTemplate,
  MessagesPlaceholder,
} = require("@langchain/core/prompts");

const {
  RunnablePassthrough,
  RunnableSequence,
} = require("@langchain/core/runnables");
const { formatDocumentsAsString } = require("langchain/util/document");
const { generateLLMConfig } = require("../config/llmConfig");

function retriever(filter) {
  return vectorStore.asRetriever({
    k: 4,
    searchType: "similarity",
    filter,
  });
}
const contextualizeQPrompt = ChatPromptTemplate.fromMessages([
  ["system", contextualizeQSystemPrompt],
  new MessagesPlaceholder("chat_history"),
  ["human", "{question}"],
]);

const contextualizeQChain = contextualizeQPrompt
  .pipe(generateLLMConfig(0.7))
  .pipe(new StringOutputParser());

function generateQASystemPrompt(instructions) {
  const combinedPrompt = qaSystemPrompt + "\n" + instructions;
  return ChatPromptTemplate.fromMessages([
    ["system", combinedPrompt],
    new MessagesPlaceholder("chat_history"),
    ["human", "{question}"],
  ]);
}

const contextualizedQuestion = (input) => {
  if ("chat_history" in input) {
    return contextualizeQChain;
  }
  return input.question;
};

async function ragChain({
  filter,
  question,
  chat_history,
  instructions,
  temperature,
}) {
  const prompt = generateQASystemPrompt(instructions);
  const llm = generateLLMConfig(temperature);

  return RunnableSequence.from([
    RunnablePassthrough.assign({
      context: (input) => {
        if ("chat_history" in input) {
          const chain = contextualizedQuestion(input);
          return chain.pipe(retriever(filter)).pipe(formatDocumentsAsString);
        }
        return "";
      },
    }),
    prompt,
    llm,
  ]).invoke({
    question,
    chat_history,
  });
}

module.exports = { ragChain };
