import { CommentRepository } from "../repositories/CommentRepository";
import { Comment, NewComment } from "../types";
import { z } from "zod";

type NewCommentType = z.infer<typeof NewComment>
type CommentType = z.infer<typeof Comment>

export type CommentWithReplies = CommentType & {
    replies: CommentWithReplies[]
}

export class CommentService {
    constructor(private repository: CommentRepository) { }

    /** Create a new comment */
    async createComment(data: NewCommentType, ip_address: string): Promise<number> {
        data.parent_id = data.parent_id === 0 ? null : (data.parent_id ?? null)
        return this.repository.create(data, ip_address)
    }

    /** Find all comments by target id */
    async findAllByTargetId(targetId: string): Promise<CommentWithReplies[]> {

        // 1. Find all comments by target id
        const flatComments = await this.repository.findAllByTargetId(targetId)

        // 2. Group comments by parent id
        const commentMap = new Map<number, CommentWithReplies>()
        const rootComments: CommentWithReplies[] = []

        // 3. Convert flatComments to commentMap
        flatComments.forEach(comment => {
            commentMap.set(comment.id, { ...comment, replies: [] });
        });

        // 4. Mount replies to parent comments
        flatComments.forEach(comment => {
            const current = commentMap.get(comment.id)!;

            if (comment.parent_id === null) {
                // if parent_id is null, it is a root comment
                rootComments.push(current);
            } else {
                // find parent comment
                const parent = commentMap.get(comment.parent_id);
                if (parent) {
                    parent.replies.push(current);
                } else {
                    // if parent comment not found, push to root comments
                    rootComments.push(current);
                }
            }
        });

        return rootComments
    }
}