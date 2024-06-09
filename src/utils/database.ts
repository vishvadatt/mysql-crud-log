import { db } from "../config/database";
import { Request } from "express";
import * as logger from "./logger";

export const Query = async (
  query: string,
  args?: any,
  req?: Request
): Promise<any> => {
  try {
    const [result] = await db.query(query, args);
    logger.logSuccess(
      `\nMethod: ${req?.method}\nURL: ${
        req?.url
      }\nQUERY: ${query}\nargs: ${JSON.stringify(args)}`,
      "success_query"
    );
    return result;
  } catch (error: any) {
    logger.logError(
      `\n Method: ${req?.method}\n URL: ${req?.url}\n body : ${JSON.stringify(
        req?.body
      )}\n Query: ${JSON.stringify(req?.query)}\n Params: ${JSON.stringify(
        req?.params
      )}\n code: ${error?.code}\n errno: ${error?.errno}\n sql: ${
        error?.sql
      }\n sqlState: ${error?.sqlState}\n sqlMessage: ${error?.sqlMessage}`,
      "error"
    );
    console.log(error);
  }
};
