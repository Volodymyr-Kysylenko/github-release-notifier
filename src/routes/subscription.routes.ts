import { Router } from "express";
import { subscriptionController } from "../controllers/subscription.controller.js";
import { asyncHandler } from "../utils/async-handler.js";

const { subscribe, confirm, unsubscribe, list } = subscriptionController;
const { confirmPage, unsubscribePage, subscriptionsPage } = subscriptionController;

// API
export const subscriptionRouter = Router();
subscriptionRouter.post("/subscribe", asyncHandler(subscribe));
subscriptionRouter.get("/confirm/:token", asyncHandler(confirm));
subscriptionRouter.get("/unsubscribe/:token", asyncHandler(unsubscribe));
subscriptionRouter.get("/subscriptions", asyncHandler(list));

// HTML pages
export const subscriptionPagesRouter = Router();
subscriptionPagesRouter.get("/confirm/:token", asyncHandler(confirmPage));
subscriptionPagesRouter.get("/unsubscribe/:token", asyncHandler(unsubscribePage));
subscriptionPagesRouter.get("/subscriptions", asyncHandler(subscriptionsPage));
