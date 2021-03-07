import { Sequelize } from "sequelize";
import { pgHost, pgPass, pgPort, pgUser } from "../config";

export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: pgHost,
  username: pgUser,
  password: pgPass,
  port: pgPort,
  logging: false
})

export * from "sequelize"