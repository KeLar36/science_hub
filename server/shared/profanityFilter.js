const filter = require("leo-profanity");

filter.loadDictionary("uk");

const containsBadWords = (text) => {
  if (!text || typeof text !== "string") return false;
  return filter.check(text);
};

module.exports = { containsBadWords };
