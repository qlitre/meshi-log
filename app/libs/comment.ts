export type Comment = {
  id: number
  visit_id: string
  author: string
  content: string
  created_at: string
}

export const getCommentsByVisitId = async (db: D1Database, visitId: string): Promise<Comment[]> => {
  const result = await db
    .prepare(
      'SELECT id, visit_id, author, content, created_at FROM comments WHERE visit_id = ? ORDER BY created_at ASC'
    )
    .bind(visitId)
    .all<Comment>()
  return result.results
}

export const createComment = async (
  db: D1Database,
  params: { visitId: string; author: string; content: string }
) => {
  const now = new Date().toISOString()
  await db
    .prepare('INSERT INTO comments (visit_id, author, content, created_at) VALUES (?, ?, ?, ?)')
    .bind(params.visitId, params.author, params.content, now)
    .run()
}
