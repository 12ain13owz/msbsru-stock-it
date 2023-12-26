export default {
  port: process.env.PORT || 3000,
  storage: process.env.DB_STORAGE || "database/msbsru_stock_it.sqlite",
  logLevel: "info",
};
