const { Tiktoken } = require('tiktoken/lite');
const cl100k_base = require('tiktoken/encoders/cl100k_base.json');

function countTokens(messages) {
  const encoding = new Tiktoken(
    cl100k_base.bpe_ranks,
    cl100k_base.special_tokens,
    cl100k_base.pat_str
  );

  let count = 0;
  for (const message of messages) {
    count += 4; // every message follows <im_start>{role/name}\n{content}<im_end>\n

    for (const [key, value] of Object.entries(message)) {
      count += encoding.encode(value).length;
      if (key === 'name') {
        count -= 1;
      }
    }
  }

  encoding.free();

  count += 2; // every reply is primed with <im_start>assistant
  return count;
}

module.exports = { countTokens };
