import { Bool, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { type AppContext, Comment, NewComment } from "../types";

import { CommentRepository } from "../repositories/CommentRepository";
import { CommentService } from "../services/CommentService";

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
                            series: z.object({
                                success: Bool(),
                                result: z.object({
                                    comment: Comment,
                                }),
                            }),
                        }),
                    },
                },
            },
        },
    }

    async handle(c: AppContext) {
        const data = await this.getValidatedData<typeof this.schema>();
        const { body } = data;

        // Get IP Address
        const ip_address = c.req.header("CF-Connecting-IP") || "0.0.0.0";

        // Verify Trunstile Token
        // todo: implement trunstile verification

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