import { fromHono } from "chanfana";
import { Hono } from "hono";
import { CommentCreate } from "./endpoints/commentCreate";
import { CommentFetch } from "./endpoints/commentFetch";

// Start a Hono app
const app = new Hono<{ Bindings: Env }>();

// Setup OpenAPI registry
const openapi = fromHono(app, {
	docs_url: "/",
});

// Register OpenAPI endpoints
openapi.post("/api/comments", CommentCreate);
openapi.get("/api/comments/:commentId", CommentFetch);

// Export the Hono app
export default app;
