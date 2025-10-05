import { jsxRenderer } from 'hono/jsx-renderer'
import { Link, Script } from 'honox/server'
import { Header } from '../components/Header'

export default jsxRenderer(({ children, meta }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/*<!-- OGP -->*/}
        <meta property="og:title" content={meta?.title} />
        <meta property="og:description" content={meta?.description} />
        <meta property="og:url" content={meta?.ogpUrl} />
        <meta property="og:site_name" content='meshi-log' />
        <meta property="og:image" content={meta?.ogpImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:type" content={meta?.ogpType} />
        <meta property="article:author" content='https://twitter.com/kuri_tter' />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:creator" content='@kuri_tter'/>
        <link rel="icon" href="/favicon.ico" />
        <Link href="/app/style.css" rel="stylesheet" />
        <Script src="/app/client.ts" async />
      </head>
      <body>
        <Header/>
        {children}
        </body>
    </html>
  )
})
