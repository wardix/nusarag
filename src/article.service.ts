import pool from './database'
import type { ArticleRequest, Article } from './article.types'

export class ArticleService {
  async createArticle(articleData: ArticleRequest): Promise<Article> {
    const client = await pool.connect()

    try {
      const query = `
        INSERT INTO articles (title, content, author, organization_id, status, created_by, updated_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `

      const values = [
        articleData.title,
        articleData.content,
        articleData.author || null,
        articleData.organization_id || null,
        articleData.status || 'draft',
        articleData.created_by || null,
        articleData.created_by || null, // updated_by sama dengan created_by saat create
      ]

      const result = await client.query(query, values)
      return result.rows[0]
    } finally {
      client.release()
    }
  }

  async getAllArticles(): Promise<Article[]> {
    const client = await pool.connect()

    try {
      const query = `
        SELECT a.*, o.name as organization_name
        FROM articles a
        LEFT JOIN organizations o ON a.organization_id = o.id
        ORDER BY a.created_at DESC
      `

      const result = await client.query(query)
      return result.rows
    } finally {
      client.release()
    }
  }

  async getArticleById(id: number): Promise<Article | null> {
    const client = await pool.connect()

    try {
      const query = `
        SELECT a.*, o.name as organization_name
        FROM articles a
        LEFT JOIN organizations o ON a.organization_id = o.id
        WHERE a.id = $1
      `

      const result = await client.query(query, [id])
      return result.rows[0] || null
    } finally {
      client.release()
    }
  }
}
