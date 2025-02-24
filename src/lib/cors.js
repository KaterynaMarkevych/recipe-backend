export const runCors = (req, res, next) => {
  // Додаємо необхідні заголовки CORS
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173"); // Дозволяє доступ з фронтенду
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE"); // Дозволяє певні HTTP-методи
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); // Дозволяє ці заголовки в запитах

  // Якщо це pre-flight запит (OPTIONS), відразу повертаємо статус 200
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Інакше передаємо контроль до наступного middleware
  next();
};
