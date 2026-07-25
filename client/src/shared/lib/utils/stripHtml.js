export const stripHtml = (html) => {
  if (!html || typeof html !== "string") return "";

  const cleanText = html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, " ")
    .trim();

  return cleanText;
};

export const isQuillEmpty = (html) => {
  return stripHtml(html).length === 0;
};
