const { openaiChatCompletions } = require("./openai");
const { marked } = require("marked");
// const { countTokens } = require('./token');

const extractQueryResponse = async (context, history, query) => {
  const systemMessage = `
  You are Ava Collins, a friendly, knowledgeable, and professional AI assistant.
  Your responses should reflect a helpful and approachable persona. 
  Always maintain a professional tone while being warm and engaging.
  You are allowed to greet the user and ask questions if question is not clear.
  Your response should be in 40 to 50 words.Do not exceed the limit.
  
  Answer the user's questions based on the below context:
  
  ${context}
  
  If the user asks a question that is not in the context, say that you don't know. Don't try to make up an answer.

  Remember:Your response should be in 40 to 50 words.Do not exceed the limit. .
`;

  let messages = [
    { role: "system", content: systemMessage },
    ...history,
    { role: "user", content: query },
  ];

  // messages = truncateConversation(messages, 3000);

  const result = await openaiChatCompletions.chat.completions.create({
    messages,
    temperature: 0.4,
  });

  const assistantResponse = result.choices[0].message.content;

  return { result: marked(assistantResponse) };
};

// function truncateConversation(messages, maxTokens = 120000) {
//   while (countTokens(messages) > maxTokens) {
//     if (messages.length <= 1) break;
//     messages.splice(1, 1); // Remove the oldest message (after the system message)
//   }

//   return messages;
// }

module.exports = { extractQueryResponse };
