import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createGrpcServer } from "../grpc/server.js";
import { createGrpcClient } from "../grpc/client.js";
import * as grpc from "@grpc/grpc-js";

describe("gRPC Subscription Service", () => {
    let server: grpc.Server;
    let client: any;
    const testPort = 50052;

    beforeAll(async () => {
        server = createGrpcServer();

        await new Promise<void>((resolve, reject) => {
            server.bindAsync(`localhost:${testPort}`, grpc.ServerCredentials.createInsecure(), (error) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            });
        });

        client = createGrpcClient(`localhost:${testPort}`);
    });

    afterAll(async () => {
        if (client) {
            client.close();
        }
        if (server) {
            await new Promise<void>((resolve) => {
                server.tryShutdown(() => resolve());
            });
        }
    });

    it("should reject invalid subscription request", async () => {
        const request = new Promise((resolve, reject) => {
            client.Subscribe({ email: "", repo: "" }, (error: any, response: any) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(response);
                }
            });
        });

        await expect(request).rejects.toMatchObject({
            code: grpc.status.INVALID_ARGUMENT,
            details: expect.stringContaining("Email and repo are required"),
        });
    });

    it("should reject invalid token for confirm", async () => {
        const request = new Promise((resolve, reject) => {
            client.Confirm({ token: "" }, (error: any, response: any) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(response);
                }
            });
        });

        await expect(request).rejects.toMatchObject({
            code: grpc.status.INVALID_ARGUMENT,
            details: expect.stringContaining("Invalid token"),
        });
    });

    it("should reject empty email for get subscriptions", async () => {
        const request = new Promise((resolve, reject) => {
            client.GetSubscriptions({ email: "" }, (error: any, response: any) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(response);
                }
            });
        });

        await expect(request).rejects.toMatchObject({
            code: grpc.status.INVALID_ARGUMENT,
            details: expect.stringContaining("Email is required"),
        });
    });
});
