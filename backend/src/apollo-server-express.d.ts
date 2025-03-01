declare module "@apollo/server/express4" {
  import { ApolloServer } from "@apollo/server";

  export function expressMiddleware(server: ApolloServer, options?: any): any;
}

declare module "@apollo/server/plugin/drainHttpServer" {
  import http from "http";
  import { ApolloServerPlugin } from "@apollo/server";

  export function ApolloServerPluginDrainHttpServer(options: {
    httpServer: http.Server;
  }): ApolloServerPlugin;
}
