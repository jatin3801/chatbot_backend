const { openaiChatCompletions } = require("./openai");

const extractQueryResponse = async (context, query) => {
  const prompt = `Use the following pieces of context to answer the question at the end use only this context dont produce own answers strictly answer form this context only.
        If you don't know the answer, just say that you don't know and it is out of context, don't try to make up an answer.
        Always say "thanks for asking!" at the end of the answer.
        Always be specific.
      
        context: ${context}
      
        Question: ${query}
      
        Answer:`;
  const result = await openaiChatCompletions.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant that answer politely and answer to the user",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "",
  });

  for (const choice of result.choices) {
    const extratedAnswer = choice?.message?.content;
    return extratedAnswer;
  }
};

module.exports = { extractQueryResponse };
