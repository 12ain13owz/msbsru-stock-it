import fs from "fs";
import path from "path";
import config from "config";
import log from "./logger";
import sequelize from "../models";

export default async function connectDatabase() {
  try {
    const dbPath = path.join(process.cwd(), config.get<string>("storage"));
    const isDbExist = fs.existsSync(dbPath);

    await sequelize.sync();
    if (!isDbExist) bootstrapDatabase();
  } catch (error: any) {
    log.error("connectDatabase:", error.message);
    process.exit(1);
  } finally {
    log.info("Connected database successfully");
  }
}

async function bootstrapDatabase() {}
