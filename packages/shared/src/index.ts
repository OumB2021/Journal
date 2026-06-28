import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(1).max(120),
  body: z.string().min(1).max(10_000),
});
export type CreatePostInput = z.infer<typeof createPostSchema>;

export const postSchema = createPostSchema.extend({
  id: z.string().uuid(),
  authorId: z.string(),
  createdAt: z.string().datetime(),
});
export type Post = z.infer<typeof postSchema>;
