import { z } from "zod";

// Request DTOs
export const CreateSubscriptionDto = z.object({
    email: z.string().email(),
    repo: z.string().regex(/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/, "Invalid repo format"),
});

export const ConfirmSubscriptionDto = z.object({
    token: z.string().min(1),
});

export const UnsubscribeDto = z.object({
    token: z.string().min(1),
});

export const ListSubscriptionsDto = z.object({
    email: z.string().email(),
});

// Response DTOs
export const SubscriptionResponseDto = z.object({
    email: z.string(),
    repo: z.string(),
    confirmed: z.boolean(),
    last_seen_tag: z.string().nullable(),
});

export const ApiResponseDto = z.object({
    message: z.string(),
    data: z.unknown().optional(),
});

export const ErrorResponseDto = z.object({
    message: z.string(),
    code: z.string().optional(),
    errors: z
        .array(
            z.object({
                field: z.string(),
                message: z.string(),
            }),
        )
        .optional(),
});

export type CreateSubscriptionRequest = z.infer<typeof CreateSubscriptionDto>;
export type ConfirmSubscriptionRequest = z.infer<typeof ConfirmSubscriptionDto>;
export type UnsubscribeRequest = z.infer<typeof UnsubscribeDto>;
export type ListSubscriptionsRequest = z.infer<typeof ListSubscriptionsDto>;
export type SubscriptionResponse = z.infer<typeof SubscriptionResponseDto>;
export type ApiResponse = z.infer<typeof ApiResponseDto>;
export type ErrorResponse = z.infer<typeof ErrorResponseDto>;
