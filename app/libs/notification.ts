import { createMimeMessage } from 'mimetext'
import { EmailMessage } from 'cloudflare:email'

type NotifyParams = {
  email: SendEmail
  notificationEmail: string
  visitId: string
  author: string
  content: string
}

export const notifyNewComment = async ({
  email,
  notificationEmail,
  visitId,
  author,
  content,
}: NotifyParams) => {
  const senderAddress = 'noreply@meshi-log.info'

  const msg = createMimeMessage()
  msg.setSender({ name: '飯ログ', addr: senderAddress })
  msg.setRecipient(notificationEmail)
  msg.setSubject(`新しいコメント: ${author}`)
  msg.addMessage({
    contentType: 'text/plain',
    data: [
      `訪問記録にコメントが投稿されました。`,
      ``,
      `投稿者: ${author}`,
      `内容: ${content}`,
      ``,
      `確認: https://meshi-log.info/visits/${visitId}`,
    ].join('\n'),
  })

  const message = new EmailMessage(senderAddress, notificationEmail, msg.asRaw())
  await email.send(message)
}
