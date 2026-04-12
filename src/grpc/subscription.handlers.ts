import * as grpc from "@grpc/grpc-js";
import { subscriptionService } from "../services/subscription.service.js";
import { AppError } from "../utils/errors.js";

export const subscriptionHandlers = {
    async Subscribe(call: any, callback: any) {
        try {
            const { email, repo } = call.request;

            if (!email || !repo) {
                return callback({
                    code: grpc.status.INVALID_ARGUMENT,
                    details: "Email and repo are required",
                });
            }

            await subscriptionService.subscribe({ email, repo });

            callback(null, {
                message: "Subscription successful. Confirmation email sent.",
            });
        } catch (error) {
            if (error instanceof AppError) {
                const grpcCode = mapHttpToGrpcStatus(error.statusCode);
                callback({
                    code: grpcCode,
                    details: error.message,
                });
            } else {
                callback({
                    code: grpc.status.INTERNAL,
                    details: "Internal server error",
                });
            }
        }
    },

    async Confirm(call: any, callback: any) {
        try {
            const { token } = call.request;

            if (!token?.trim()) {
                return callback({
                    code: grpc.status.INVALID_ARGUMENT,
                    details: "Invalid token",
                });
            }

            await subscriptionService.confirm(token);

            callback(null, {
                message: "Subscription confirmed successfully",
            });
        } catch (error) {
            if (error instanceof AppError) {
                const grpcCode = mapHttpToGrpcStatus(error.statusCode);
                callback({
                    code: grpcCode,
                    details: error.message,
                });
            } else {
                callback({
                    code: grpc.status.INTERNAL,
                    details: "Internal server error",
                });
            }
        }
    },

    async Unsubscribe(call: any, callback: any) {
        try {
            const { token } = call.request;

            if (!token?.trim()) {
                return callback({
                    code: grpc.status.INVALID_ARGUMENT,
                    details: "Invalid token",
                });
            }

            await subscriptionService.unsubscribe(token);

            callback(null, {
                message: "Unsubscribed successfully",
            });
        } catch (error) {
            if (error instanceof AppError) {
                const grpcCode = mapHttpToGrpcStatus(error.statusCode);
                callback({
                    code: grpcCode,
                    details: error.message,
                });
            } else {
                callback({
                    code: grpc.status.INTERNAL,
                    details: "Internal server error",
                });
            }
        }
    },

    async GetSubscriptions(call: any, callback: any) {
        try {
            const { email } = call.request;

            if (!email?.trim()) {
                return callback({
                    code: grpc.status.INVALID_ARGUMENT,
                    details: "Email is required",
                });
            }

            const subscriptions = await subscriptionService.listByEmail(email);

            callback(null, {
                subscriptions: subscriptions.map((sub) => ({
                    email: sub.email,
                    repo: sub.repo,
                    confirmed: sub.confirmed,
                    last_seen_tag: sub.last_seen_tag || "",
                })),
            });
        } catch (error) {
            if (error instanceof AppError) {
                const grpcCode = mapHttpToGrpcStatus(error.statusCode);
                callback({
                    code: grpcCode,
                    details: error.message,
                });
            } else {
                callback({
                    code: grpc.status.INTERNAL,
                    details: "Internal server error",
                });
            }
        }
    },
};

// Map HTTP status codes to gRPC status codes
function mapHttpToGrpcStatus(httpCode: number): number {
    switch (httpCode) {
        case 400:
            return grpc.status.INVALID_ARGUMENT;
        case 404:
            return grpc.status.NOT_FOUND;
        case 409:
            return grpc.status.ALREADY_EXISTS;
        case 429:
            return grpc.status.RESOURCE_EXHAUSTED;
        default:
            return grpc.status.INTERNAL;
    }
}
