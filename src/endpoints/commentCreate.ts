import { Bool, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { type AppContext, Comment, NewComment } from "../types";

import { CommentRepository } from "../repositories/CommentRepository";
import { CommentService } from "../services/CommentService";
import { TurnstileRepository } from "../repositories/TurnstileRepository";

export class CommentCreate extends OpenAPIRoute {
    schema = {
        tags: ["Comments"],
        summary: "Create a comment",
        request: {
            body: {
                content: {
                    "application/json": {
                        schema: NewComment,
                    },
                },
            },
        },
        responses: {
            "200": {
                description: "Returns the created comment",
                content: {
                    "application/json": {
                        schema: z.object({
                            success: Bool(),
                            result: z.object({
                                comment: Comment,
                            }),
                        }),
                    },
                },
            },
            "400": {
                description: "Bad Request",
            },
        },
    }

    async handle(c: AppContext) {
        const data = await this.getValidatedData<typeof this.schema>();
        const { body } = data;

        // Get IP Address
        const ip_address = c.req.header("CF-Connecting-IP") || "0.0.0.0";

        // Verify Trunstile Token
        try {
            const turnstileRepository = new TurnstileRepository(c.env.TURNSTILE_SECRET_KEY);
            const isVerified = await turnstileRepository.verify(body.trunstile_token, ip_address);

            if (!isVerified) {
                return c.json({
                    success: false,
                    error: "Turnstile verification failed " + c.env.TURNSTILE_SECRET_KEY,
                }, 400);
            }
        } catch (e) {
            return c.json({
                success: false,
                error: "Turnstile verification error",
            }, 400);
        }

        // Initialize repository and service
        const repository = new CommentRepository(c.env.guestbook_db);
        const service = new CommentService(repository);

        // Call Service
        const newCommentId = await service.createComment({ ...body, }, ip_address);

        // Return
        return {
            success: true,
            comment: {
                id: newCommentId,
                ...body,
            },
        };
    }
}