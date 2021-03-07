import { BaseService } from "../lib/Service";
import App, { Application, Router } from "express";
import { httpHost, httpPort } from "../config";
import { Server } from "http";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "type-graphql";
import { EventResolver } from "../graphql/Event";

export class ApiService implements BaseService {
  app: Application
  router: Router
  server: Server

  async start() {
    this.app = App()
    this.router = App.Router()

    const schema = await buildSchema({
      resolvers: [EventResolver]
    })

    this.router.post('/', graphqlHTTP({
      schema: schema,
    }))

    this.app.use(this.router)
    this.server = this.app.listen(httpPort, httpHost)
    this.server.on('listening', () => 
      console.log(`Server listen on: ${httpHost}:${httpPort}`))
  }

  async stop() {
    this.server.close()
    delete this.app
    delete this.router
    delete this.server
  }
}