import "reflect-metadata";

import { sequelize } from "./lib/Sequelize"
import { ApiService } from "./services/Api";
import { LoaderService } from "./services/Loader"

const loader = new LoaderService()
const api = new ApiService()

async function main() {
  await sequelize.sync()
  await loader.start()
  await api.start()
}

main().catch(console.error)
