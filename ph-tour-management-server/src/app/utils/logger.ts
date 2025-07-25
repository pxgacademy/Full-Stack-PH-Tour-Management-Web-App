// npm install winston
// npm install winston --legacy-peer-deps
// npm install winston --force

import fs from "fs";
import path from "path";
import { createLogger, format, transports } from "winston";

// ensure logs directory exists
const logDir = path.join(__dirname, "../../../logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logFormat = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.printf(({ timestamp, level, message, ...meta }) => {
    return `[${timestamp}] ${level.toUpperCase()}: ${message} ${
      Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ""
    }`;
  })
);

const logger = createLogger({
  level: "silly",
  format: logFormat,
  transports: [
    new transports.Console({
      level: "silly",
    }),
    new transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
    }),
    new transports.File({
      filename: path.join(logDir, "combined.log"),
      level: "silly",
    }),
  ],
});

export default logger;

/*

logger.info("User successfully logged in", { userId: user._id });
logger.error("Login failed", { error });

logger.error("This is an error");
logger.warn("This is a warning");
logger.info("Just some info");
logger.debug("Debug details here");
logger.silly("Very verbose, low-level trace");

*/
