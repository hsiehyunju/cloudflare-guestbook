import { OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { type AppContext, CommentWithRepliesSchema } from "../types";

import { CommentRepository } from "../repositories/CommentRepository";
import { CommentService } from "../services/CommentService";

export class CommentFetch extends OpenAPIRoute {
    schema = {
        tags: ["Comments"],
        summary: "Get comments tree by target ID",
        request: {
            query: z.object({
                target_id: z.string().describe("Unique identifier for the article or content"),
            }),
        },
        responses: {
            "200": {
                description: "Returns a nested list of comments",
                content: {
                    "application/json": {
                        schema: z.object({
                            success: z.boolean(),
                            result: z.array(CommentWithRepliesSchema),
                        }),
                    },
                },
            },
        },
    };

    async handle(c: AppContext) {
        // 1. Get validated data
        const data = await this.getValidatedData<typeof this.schema>();
        const { target_id } = data.query;

        // 2. Initialize repository and service
        const repo = new CommentRepository(c.env.guestbook_db);
        const service = new CommentService(repo);

        // 3. Get comment tree
        const commentTree = await service.findAllByTargetId(target_id);

        // 4. Return
        return {
            success: true,
            result: commentTree,
        };
    }
}