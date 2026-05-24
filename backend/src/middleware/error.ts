import type { NextFunction, Request, Response } from "express";
import { sendError } from "../lib/http.js";

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  sendError(res, error);
};
