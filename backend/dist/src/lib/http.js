import { ZodError } from "zod";
export class HttpError extends Error {
    status;
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}
export const sendError = (res, error) => {
    if (error instanceof ZodError) {
        return res.status(400).json({
            error: "Validation failed",
            details: error.flatten(),
        });
    }
    if (error instanceof HttpError) {
        return res.status(error.status).json({ error: error.message });
    }
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
};
