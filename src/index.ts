import { fromHono } from "chanfana";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { CommentCreate } from "./endpoints/commentCreate";
import { CommentFetch } from "./endpoints/commentFetch";

// Start a Hono app
const app = new Hono<{ Bindings: Env }>();

// Use default cors middleware
app.use('/api/*', cors())

// Setup OpenAPI registry
const openapi = fromHono(app, {
	docs_url: "/",
});

// Register OpenAPI endpoints
openapi.post("/api/comments", CommentCreate);
openapi.get("/api/comments/:commentId", CommentFetch);

// Export the Hono app
export default app;
