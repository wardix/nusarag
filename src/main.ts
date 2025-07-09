import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { ArticleService } from './article.service'
import { validateArticle } from './validation.middleware'
import type { ArticleRequest } from './article.types'

const app = new Hono()

// Middleware
app.use('*', logger())
app.use('*', cors())

// Initialize services
const articleService = new ArticleService()

// Health check endpoint
app.get('/health', (c) => {
  return c.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Hono Backend Service',
  })
})

// Endpoint untuk menambah artikel
app.post('/articles', validateArticle, async (c) => {
  try {
    const body = (await c.req.json()) as ArticleRequest

    const newArticle = await articleService.createArticle(body)

    return c.json(
      {
        success: true,
        message: 'Artikel berhasil ditambahkan',
        data: newArticle,
      },
      201,
    )
  } catch (error) {
    console.error('Error creating article:', error)

    return c.json(
      {
        success: false,
        message: 'Gagal menambahkan artikel',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500,
    )
  }
})

// Endpoint untuk mendapatkan semua artikel
app.get('/articles', async (c) => {
  try {
    const articles = await articleService.getAllArticles()

    return c.json({
      success: true,
      data: articles,
    })
  } catch (error) {
    console.error('Error fetching articles:', error)

    return c.json(
      {
        success: false,
        message: 'Gagal mengambil data artikel',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500,
    )
  }
})

// Endpoint untuk mendapatkan artikel berdasarkan ID
app.get('/articles/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'))

    if (isNaN(id)) {
      return c.json(
        {
          success: false,
          message: 'ID artikel tidak valid',
        },
        400,
      )
    }

    const article = await articleService.getArticleById(id)

    if (!article) {
      return c.json(
        {
          success: false,
          message: 'Artikel tidak ditemukan',
        },
        404,
      )
    }

    return c.json({
      success: true,
      data: article,
    })
  } catch (error) {
    console.error('Error fetching article:', error)

    return c.json(
      {
        success: false,
        message: 'Gagal mengambil data artikel',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500,
    )
  }
})

export default app
