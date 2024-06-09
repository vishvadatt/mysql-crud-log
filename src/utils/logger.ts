import { appendFile, existsSync, mkdirSync } from "fs";
import { Request, NextFunction, Response } from "express";
import { join } from "path";

// require("../../logs")

const baseLogDir = join(__dirname, "../../", "logs");

if (!existsSync(baseLogDir)) {
  mkdirSync(baseLogDir);
}

export const logRequestMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const paramsString = JSON.stringify(req.params);
  const queryString = JSON.stringify(req.query);
  const payloadString = JSON.stringify(req.body);
  logRequest(`${req.method} ${req.url}`, req);
  next();
};

enum LogLevel {
  REQUEST = "REQUEST",
  ERROR = "ERROR",
  SUCCESS = "SUCCESS",
}

function getLogDir(level: LogLevel, folderName: string) {
  const date = new Date();
  const yearMonth = `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}`;

  const levelDir = join(baseLogDir, yearMonth, folderName);

  if (!existsSync(levelDir)) {
    mkdirSync(levelDir, { recursive: true });
  }
  return levelDir;
}

function log(level: LogLevel, message: string, folderName: string) {
  const logDir = getLogDir(level, folderName);
  const date = new Date();
  const dateString = date.toISOString().split("T")[0];
  const logFile = join(logDir, `${dateString}.log`);
  console.log("Log file.....", logFile);

  const timestamp = date.toISOString();
  const logMessage = `\n${timestamp}\n${level}:${message}\n`;
  appendFile(logFile, logMessage, (err) => {
    if (err) {
      console.log("Failed to write to log file " + err);
    }
  });
}

export function logRequest(
  message: string,
  req: Request
  //   reqParams: any,
  //   reqQuery: any,
  //   reqBody: any
): void {
  const paramsString = JSON.stringify(req.params);
  const queryString = JSON.stringify(req.query);
  const payloadString = JSON.stringify(req.body);

  console.log(
    `This is a request msg => ${message}\n Params: ${paramsString}\n Query: ${queryString} \n body: ${payloadString}`
  );

  log(
    LogLevel.REQUEST,
    `\nRequest Log:\n Url: ${req.url} \n Method: ${req.method} \n body: ${payloadString}\n Params: ${paramsString}\n Query: ${queryString}\n`,
    "Request"
  );
}

export function logError(message: string, folderName: string) {
  log(LogLevel.ERROR, message, folderName);
}

export function logSuccess(message: string, folderName: string) {
  log(LogLevel.SUCCESS, message, folderName);
}
