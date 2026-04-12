import { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";

const validateOrigin = (req: Request, res: Response, next: NextFunction) => {
    const allowedOrigins =
        env.NODE_ENV === "production"
            ? ["https://github-release-notifier.sylenity.com"]
            : ["http://localhost:3000", "http://127.0.0.1:3000"];

    const origin = req.get("Origin") || req.get("Referer")?.split("/").slice(0, 3).join("/");

    if (!origin) {
        return next();
    }

    if (!allowedOrigins.includes(origin)) {
        return res.status(403).json({
            error: "Forbidden",
            message: "Invalid origin",
        });
    }

    next();
};

export { validateOrigin };