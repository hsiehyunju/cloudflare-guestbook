import { DateTime, Str } from "chanfana";
import type { Context } from "hono";
import { z } from "zod";

export type AppContext = Context<{ Bindings: Env }>;

export const Comment = z.object({
	id: z.number(),
	target_id: Str({ required: true }),
	parent_id: z.number().nullable(),
	nickname: Str({ required: true }),
	content: Str({ required: true }),
	ip_address: Str({ required: true }),
	created_at: DateTime(),
});

export const NewComment = z.object({
	target_id: Str({ required: true }),
	parent_id: z.number().optional(),
	nickname: Str({ required: true }),
	content: Str({ required: true }),
	trunstile_token: z.string(),
});

export const CommentWithRepliesSchema: any = Comment.extend({
	replies: z.array(
		z.lazy(() => CommentWithRepliesSchema)
	),
}).openapi({
	type: "object",
	title: "CommentWithReplies",
	description: "Comment object with a list of replies",
});