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

  await email.send({
    to: notificationEmail,
    from: senderAddress,
    subject: '飯ログ - コメント通知',
    text: [
      `訪問記録にコメントが投稿されました。`,
      ``,
      `投稿者: ${author}`,
      `内容: ${content}`,
      ``,
      `確認: https://meshi-log.info/visits/${visitId}`,
    ].join('\n'),
  })
}
