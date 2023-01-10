import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут - временной промежуток приема запросов
  max: 100, // не более 100 запросов за 15 минут
  standardHeaders: true,
  legacyHeaders: false,
});

export default limiter;
