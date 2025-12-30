import { z } from "zod";
import { Comment, NewComment } from "../types";

type NewCommentType = z.infer<typeof NewComment>
type CommentType = z.infer<typeof Comment>

export class CommentRepository {
    constructor(private db: D1Database) { }

    async create(
        data: NewCommentType,
        ip_address: string
    ): Promise<number> {
        const { target_id, parent_id, nickname, content } = data
        const result = await this.db.prepare(
            'INSERT INTO comments (target_id, parent_id, nickname, content, ip_address) VALUES (?, ?, ?, ?, ?)'
        ).bind(target_id, parent_id ?? null, nickname, content, ip_address).run()

        return result.meta.last_row_id
    }

    async findAllByTargetId(targetId: string): Promise<CommentType[]> {
        const result = await this.db.prepare(
            'SELECT * FROM comments WHERE target_id = ? ORDER BY created_at DESC'
        ).bind(targetId).all<CommentType>()

        return result.results
    }
}