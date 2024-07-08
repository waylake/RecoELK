export default {
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/bookstore",
  REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",
  ES_NODE: process.env.ES_NODE || "http://localhost:9200",
  SESSION_SECRET: process.env.SESSION_SECRET || "your-secret-key",
  JWT_SECRET: process.env.JWT_SECRET || "your-jwt-secret-key",
};
