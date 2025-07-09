import { z } from 'zod'
import type { Context, Next } from 'hono'

const articleSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
  content: z.string().min(1, 'Content is required'),
  author: z.string().max(100, 'Author name too long').optional(),
  organization_id: z.number().positive().optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  created_by: z.string().max(100, 'Created by name too long').optional(),
})

export const validateArticle = async (c: Context, next: Next) => {
  try {
    const body = await c.req.json()

    const validationResult = articleSchema.safeParse(body)

    if (!validationResult.success) {
      return c.json(
        {
          success: false,
          message: 'Validation failed',
          errors: validationResult.error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        400,
      )
    }

    await next()
  } catch (error) {
    return c.json(
      {
        success: false,
        message: 'Invalid JSON format',
      },
      400,
    )
  }
}
