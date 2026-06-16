import { sendError } from "../lib/http.js";
export const errorHandler = (error, _req, res, _next) => {
    sendError(res, error);
};
