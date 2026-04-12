import path from "node:path";
import type { Request, Response, NextFunction } from "express";
import { subscriptionService } from "../services/subscription.service.js";
import { AppError } from "../utils/errors.js";

type ControllerMethod = (req: Request, res: Response, next: NextFunction) => Promise<void>;

class SubscriptionController {
    subscribe: ControllerMethod = async (req, res) => {
        const { email, repo } = req.body;

        if (!email || !repo) {
            throw AppError.validation("Email and repo are required");
        }

        await subscriptionService.subscribe({ email, repo });

        res.status(201).json({
            message: "Subscription successful. Confirmation email sent.",
        });
    };

    confirm: ControllerMethod = async (req, res) => {
        const token = this.extractParam(req.params.token);

        await subscriptionService.confirm(token);

        res.status(200).json({ message: "Subscription confirmed successfully" });
    };

    confirmPage: ControllerMethod = async (req, res) => {
        const token = this.extractParam(req.params.token);

        try {
            await subscriptionService.confirm(token);
            res.status(200).sendFile(path.resolve(process.cwd(), "public", "confirm.html"));
        } catch (error) {
            if (error instanceof AppError && (error.statusCode === 400 || error.statusCode === 404)) {
                res.status(404).sendFile(path.resolve(process.cwd(), "public", "error.html"));
            } else {
                throw error;
            }
        }
    };

    unsubscribe: ControllerMethod = async (req, res) => {
        const token = this.extractParam(req.params.token);

        await subscriptionService.unsubscribe(token);

        res.status(200).json({ message: "Unsubscribed successfully" });
    };

    unsubscribePage: ControllerMethod = async (req, res) => {
        const token = this.extractParam(req.params.token);

        try {
            await subscriptionService.unsubscribe(token);
            res.status(200).sendFile(path.resolve(process.cwd(), "public", "unsubscribe.html"));
        } catch (error) {
            if (error instanceof AppError && (error.statusCode === 400 || error.statusCode === 404)) {
                res.status(404).sendFile(path.resolve(process.cwd(), "public", "error.html"));
            } else {
                throw error;
            }
        }
    };

    list: ControllerMethod = async (req, res) => {
        const email = this.extractQueryParam(req.query.email);

        if (!email) {
            throw AppError.validation("Email query parameter is required");
        }

        const result = await subscriptionService.listByEmail(email);
        res.status(200).json(result);
    };

    subscriptionsPage: ControllerMethod = async (req, res) => {
        res.status(200).sendFile(path.resolve(process.cwd(), "public", "subscriptions.html"));
    };

    private extractParam(param: unknown): string {
        const value = Array.isArray(param) ? param[0] : param;
        if (typeof value !== "string" || !value.trim()) {
            throw AppError.validation("Invalid or missing token");
        }
        return value;
    }

    private extractQueryParam(param: unknown): string {
        if (typeof param === "string") return param;
        if (Array.isArray(param) && typeof param[0] === "string") return param[0];
        return "";
    }
}

export const subscriptionController = new SubscriptionController();
