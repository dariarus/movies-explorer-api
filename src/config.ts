const envPath = `./.env.${process.env.NODE_ENV}`;

require('dotenv').config({ path: envPath });

const {
  NODE_ENV,
  DATABASE_PATH,
  JWT_SECRET,
  // FRONTEND_URL,
} = process.env;

export const port = 3000;
export const nodeEnv = NODE_ENV || 'local';
export const databasePath = DATABASE_PATH || 'mongodb://root:example@localhost:27017/moviesdb?authSource=admin';
export const jwtSecret = nodeEnv === 'local' ? 'dev-secret' : JWT_SECRET;

// TODO: настроить ссылку на фронт в продакшне
// export const frontendUrl = nodeEnv === 'local' ? 'http://localhost:3001' : FRONTEND_URL;
export const frontendUrl = 'http://localhost:3001';
