import type { Comment } from '../libs/comment'
import { jstDatetime } from '../utils/jstDatetime'

type Props = {
  comments: Comment[]
}

export const CommentList = ({ comments }: Props) => {
  if (comments.length === 0) return null

  return (
    <div class="mt-8 max-w-[860px] mx-auto">
      <h2 class="text-xl font-bold mb-4">コメント ({comments.length})</h2>
      <div class="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} class="bg-gray-50 rounded-lg p-4">
            <div class="flex items-center gap-2 mb-2">
              <span class="font-medium text-gray-900">{comment.author}</span>
              <time class="text-sm text-gray-500">
                {jstDatetime(comment.created_at, 'YYYY年M月D日 HH:mm')}
              </time>
            </div>
            <p class="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
