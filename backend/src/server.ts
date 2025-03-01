import express from "express";
import http from "http";
import cors from "cors";
import { json } from "body-parser";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import typeDefs from "./schema";
import resolvers from "./resolvers";
import sequelize from "./database";

async function startServer() {
  // Check database connection first
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully");

    // Sync models - use alter: true instead of force: true to avoid data loss
    await sequelize.sync({ alter: true });
    console.log("Database models synchronized successfully");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1); // Exit if database connection fails
  }

  // Create Express app and HTTP server
  const app = express();
  const httpServer = http.createServer(app);

  // Add basic Express middleware BEFORE Apollo setup
  // This enables CORS for all routes, including the GraphQL endpoint
  app.use(
    cors({
      origin: "*", // Allow all origins in development
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );
  app.use(json());

  // Create Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    introspection: true, // Enable schema introspection in all environments
  });

  // Start Apollo Server
  await server.start();

  // Apply GraphQL middleware
  app.use("/graphql", cors(), json(), expressMiddleware(server) as any);

  // Add a health check endpoint
  app.get("/health", (_, res) => {
    res.status(200).send("OK");
  });

  // Add a test endpoint to check if Express is working
  app.get("/", (_, res) => {
    res.status(200).send("Digital Dreamscapes API is running");
  });

  // Start Express server with proper error handling
  try {
    await new Promise<void>((resolve) => {
      httpServer.listen({ port: 4000 }, () => {
        console.log(`🚀 Server ready at http://localhost:4000/graphql`);
        console.log(`Health check available at http://localhost:4000/health`);
        resolve();
      });
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

// Start server with proper error handling
startServer().catch((error) => {
  console.error("Error starting server:", error);
  process.exit(1);
});
