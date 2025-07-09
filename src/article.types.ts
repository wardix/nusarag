export interface ArticleRequest {
  title: string
  content: string
  author?: string
  organization_id?: number
  status?: 'draft' | 'published' | 'archived'
  created_by?: string
}

export interface Article {
  id: number
  title: string
  content: string
  author?: string
  organization_id?: number
  created_at: Date
  updated_at: Date
  status: 'draft' | 'published' | 'archived'
  created_by?: string
  updated_by?: string
}
