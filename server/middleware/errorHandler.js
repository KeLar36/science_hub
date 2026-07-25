const errorHandler = (err, req, res, next) => {
  console.error("Error Caught:", err.stack);

  if (err.kind === "ObjectId") {
    return res.status(400).json({ error: "Некоректний формат ID" });
  }

  if (err.code === 11000) {
    return res
      .status(400)
      .json({ error: "Такий запис уже існує в базі даних" });
  }

  const statusCode =
    err.statusCode ||
    err.status ||
    (res.statusCode !== 200 ? res.statusCode : 500);

  res.status(statusCode).json({
    error: err.message || "Внутрішня помилка сервера",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = errorHandler;
