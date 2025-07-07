/* eslint-disable no-console */
import type { Server } from "http";
import app from "./app";
import { env_config } from "./config";
import { connect_db } from "./database/connect_db";

let server: Server;

(async () => {
  try {
    await connect_db();
    server = app.listen(env_config.port, () => {
      console.log(`Server running on port ${env_config.port}`);
    });
  } catch (error) {
    console.log("server running error: ", error);
  }
})();

//* unhandled rejection error
// Promise.reject(new Error("I forgot to catch this promise"));

process.on("unhandledRejection", (err) => {
  console.log("Unhandled rejection detected, Server is shutting down...", err);
  if (server) return server.close(() => process.exit(1));
  process.exit(1);
});

//* uncaught rejection error
// throw new Error("I forgot to handle this local error");

process.on("uncaughtException", (err) => {
  console.log("Unhandled exception detected, Server is shutting down...", err);
  if (server) return server.close(() => process.exit(1));
  process.exit(1);
});

//* signal terminal sigterm

process.on("SIGTERM", () => {
  console.log("SIGTERM signal issue detected, Server is shutting down...");
  if (server) return server.close(() => process.exit(1));
  process.exit(1);
});
