import { Sequelize } from "sequelize";
import path from "path";
import sqlite3 from "sqlite3";

const storagePath =
  process.env.SQLITE_PATH || path.resolve(process.cwd(), "sqlite/dev.sqlite");

export const sequelize = new Sequelize({
  dialect: "sqlite",
  dialectModule: sqlite3,
  storage: storagePath,
  logging: process.env.SQLITE_LOGGING === "true" ? console.log : false,
});

let synced = false;

export async function ensureDatabase() {
  if (synced) {
    return;
  }
  await sequelize.authenticate();
  await sequelize.sync();
  synced = true;
}
